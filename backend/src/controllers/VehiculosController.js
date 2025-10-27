//Falta-En Revision
import prisma from "../database.js";

const ESTADOS_PERMITIDOS = ["Disponible", "En Mantenimiento", "No Disponible"];
const COMBUSTIBLES_PERMITIDOS = ["Diésel", "Regular", "Gasolina Super"]; 

function isValidYear(anio) {
  const y = parseInt(anio);
  if (isNaN(y)) return false;
  const current = new Date().getFullYear();
  return y >= 1886 && y <= current;
}

export default class VehiculosController {
  static async getAll(_req, res) {
    try {
      const vehiculos = await prisma.vehiculos.findMany({
        where: { fecha_eliminacion: null },
        include: {
          proveedores: { select: { proveedor_id: true, nombre_proveedor: true } }
        },
        orderBy: { vehiculo_id: "asc" }
      });

      const data = vehiculos.map(v => ({
        ...v,
        proveedor: v.proveedores?.nombre_proveedor ?? null
      }));

      res.json({ ok: true, data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async getById(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) {
      return res.status(400).json({ ok: false, msg: "El id del vehículo debe ser un número" });
    }

    try {
      const veh = await prisma.vehiculos.findFirst({
        where: { AND: [{ vehiculo_id: idNum }, { fecha_eliminacion: null }] },
        include: {
          proveedores: { select: { proveedor_id: true, nombre_proveedor: true } }
        }
      });

      if (!veh) {
        return res.status(404).json({ ok: false, msg: `No se encontró el vehículo con id: ${idNum}` });
      }

      res.json({ ok: true, data: { ...veh, proveedor: veh.proveedores?.nombre_proveedor ?? null } });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server Error, something went wrong" });
    }
  }

  static async create(req, res) {
    const {
      proveedor_id,       
      marca,
      modelo,
      anio,
      placa,
      tipo_de_vehiculo,
      tipo_de_combustible,
      estado,
      fecha_registro
    } = req.body;

    if (!marca || !modelo || !placa) {
      return res.status(400).json({ ok: false, msg: "Faltan campos obligatorios: marca, modelo y placa" });
    }

    if (anio !== undefined && anio !== null && !isValidYear(anio)) {
      return res.status(400).json({ ok: false, msg: "anio inválido (>= 1886 y <= año actual)" });
    }

    if (estado !== undefined && estado !== null && !ESTADOS_PERMITIDOS.includes(estado)) {
      return res.status(400).json({ ok: false, msg: `estado inválido. Valores permitidos: ${ESTADOS_PERMITIDOS.join(", ")}` });
    }

    if (tipo_de_combustible !== undefined && tipo_de_combustible !== null &&
        !COMBUSTIBLES_PERMITIDOS.includes(tipo_de_combustible)) {
      return res.status(400).json({ ok: false, msg: `tipo_de_combustible inválido. Valores permitidos: ${COMBUSTIBLES_PERMITIDOS.join(", ")}` });
    }

    let proveedorId = null;
    if (req.body.hasOwnProperty("proveedor_id")) {
      if (proveedor_id === null) {
        proveedorId = null;
      } else {
        const parsed = parseInt(proveedor_id);
        if (isNaN(parsed)) {
          return res.status(400).json({ ok: false, msg: "El id del proveedor debe ser un número" });
        }
        const provOk = await prisma.proveedores.findFirst({
          where: { AND: [{ proveedor_id: parsed }, { fecha_eliminacion: null }] }
        });
        if (!provOk) {
          return res.status(400).json({ ok: false, msg: "El proveedor no existe o fue dado de baja" });
        }
        proveedorId = parsed;
      }
    }

    let fRegistro = null;
    if (fecha_registro) {
      const parsed = new Date(fecha_registro);
      if (isNaN(parsed.getTime())) return res.status(400).json({ ok: false, msg: "fecha_registro no es válida" });
      fRegistro = parsed;
    }

    const placaNorm = String(placa).trim().toUpperCase();

    try {
      const nuevo = await prisma.vehiculos.create({
        data: {
          proveedor_id: proveedorId,
          marca: marca.trim(),
          modelo: modelo.trim(),
          anio: anio !== undefined && anio !== null ? parseInt(anio) : null,
          placa: placaNorm,
          tipo_de_vehiculo: tipo_de_vehiculo?.trim() ?? null,
          tipo_de_combustible: tipo_de_combustible ?? null,
          estado: estado ?? null,
          fecha_registro: fRegistro
        },
        include: {
          proveedores: { select: { proveedor_id: true, nombre_proveedor: true } }
        }
      });

      res.status(201).json({
        ok: true,
        msg: "Vehículo creado correctamente",
        data: { ...nuevo, proveedor: nuevo.proveedores?.nombre_proveedor ?? null }
      });
    } catch (error) {
      console.log(error);
      if (error?.code === "P2002" && error?.meta?.target?.includes("placa")) {
        return res.status(400).json({ ok: false, msg: "La placa ya está registrada" });
      }
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id del vehículo debe ser un número" });

    try {
      const old = await prisma.vehiculos.findUnique({ where: { vehiculo_id: idNum } });
      if (!old || old.fecha_eliminacion !== null) {
        return res.status(404).json({ ok: false, msg: "No se encontró el vehículo que se desea modificar" });
      }

      const {
        proveedor_id,
        marca,
        modelo,
        anio,
        placa,
        tipo_de_vehiculo,
        tipo_de_combustible,
        estado,
        fecha_registro
      } = req.body;

      let proveedorId = old.proveedor_id;
      if (req.body.hasOwnProperty("proveedor_id")) {
        if (proveedor_id === null) {
          proveedorId = null;
        } else {
          const parsed = parseInt(proveedor_id);
          if (isNaN(parsed)) return res.status(400).json({ ok: false, msg: "El id del proveedor debe ser un número" });
          const provOk = await prisma.proveedores.findFirst({
            where: { AND: [{ proveedor_id: parsed }, { fecha_eliminacion: null }] }
          });
          if (!provOk) return res.status(400).json({ ok: false, msg: "El proveedor no existe o fue dado de baja" });
          proveedorId = parsed;
        }
      }

      let nuevoAnio = old.anio;
      if (req.body.hasOwnProperty("anio")) {
        if (anio === null) {
          nuevoAnio = null;
        } else {
          if (!isValidYear(anio)) {
            return res.status(400).json({ ok: false, msg: "anio inválido (>= 1886 y <= año actual)" });
          }
          nuevoAnio = parseInt(anio);
        }
      }

      let nuevoEstado = old.estado;
      if (req.body.hasOwnProperty("estado")) {
        if (estado !== null && !ESTADOS_PERMITIDOS.includes(estado)) {
          return res.status(400).json({ ok: false, msg: `estado inválido. Valores permitidos: ${ESTADOS_PERMITIDOS.join(", ")}` });
        }
        nuevoEstado = estado; 
      }

      let nuevoCombustible = old.tipo_de_combustible;
      if (req.body.hasOwnProperty("tipo_de_combustible")) {
        if (tipo_de_combustible !== null && !COMBUSTIBLES_PERMITIDOS.includes(tipo_de_combustible)) {
          return res.status(400).json({ ok: false, msg: `tipo_de_combustible inválido. Valores permitidos: ${COMBUSTIBLES_PERMITIDOS.join(", ")}` });
        }
        nuevoCombustible = tipo_de_combustible;
      }

      let fRegistro = old.fecha_registro;
      if (req.body.hasOwnProperty("fecha_registro")) {
        if (fecha_registro === null) {
          fRegistro = null;
        } else {
          const parsed = new Date(fecha_registro);
          if (isNaN(parsed.getTime())) return res.status(400).json({ ok: false, msg: "fecha_registro no es válida" });
          fRegistro = parsed;
        }
      }

      let nuevaPlaca = old.placa;
      if (req.body.hasOwnProperty("placa")) {
        if (!placa) return res.status(400).json({ ok: false, msg: "placa no puede ser vacía" });
        nuevaPlaca = String(placa).trim().toUpperCase();
      }

      try {
        const actualizado = await prisma.vehiculos.update({
          where: { vehiculo_id: idNum },
          data: {
            proveedor_id: proveedorId,
            marca: marca !== undefined ? marca.trim() : old.marca,
            modelo: modelo !== undefined ? modelo.trim() : old.modelo,
            anio: nuevoAnio,
            placa: nuevaPlaca,
            tipo_de_vehiculo: tipo_de_vehiculo !== undefined ? (tipo_de_vehiculo?.trim() ?? null) : old.tipo_de_vehiculo,
            tipo_de_combustible: nuevoCombustible,
            estado: nuevoEstado,
            fecha_registro: fRegistro,
            fecha_actualizacion: new Date()
          },
          include: {
            proveedores: { select: { proveedor_id: true, nombre_proveedor: true } }
          }
        });

        res.json({
          ok: true,
          msg: "Vehículo actualizado correctamente",
          data: { ...actualizado, proveedor: actualizado.proveedores?.nombre_proveedor ?? null }
        });
      } catch (error) {
        if (error?.code === "P2002" && error?.meta?.target?.includes("placa")) {
          return res.status(400).json({ ok: false, msg: "La placa ya está registrada" });
        }
        throw error;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) {
      return res.status(400).json({ ok: false, msg: "El id del vehículo debe ser un número" });
    }

    try {
      const existe = await prisma.vehiculos.findFirst({
        where: { AND: [{ vehiculo_id: idNum }, { fecha_eliminacion: null }] }
      });
      if (!existe) {
        return res.status(404).json({ ok: false, msg: "No se encontró el vehículo que se desea eliminar" });
      }

      const { vehiculo_id } = await prisma.vehiculos.update({
        where: { vehiculo_id: idNum },
        data: { fecha_eliminacion: new Date() }
      });

      res.json({ ok: true, msg: "Se eliminó el vehículo correctamente", id: vehiculo_id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }
}
