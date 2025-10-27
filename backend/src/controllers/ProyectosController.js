//Listo
import prisma from "../database.js";

const ESTADOS_VALIDOS = ["En Espera", "Activo", "Completado", "Cancelado"];

export default class ProyectosController {
  static async getAll(_req, res) {
    try {
      let proyectos = await prisma.proyectos.findMany({
        where: { fecha_eliminacion: null },
        orderBy: { proyecto_id: "asc" },
        include: {
          clientes: { select: { nombre_empresa: true } } 
        }
      });

      proyectos = proyectos.map(p => ({
        ...p,
        cliente_nombre: p.clientes?.nombre_empresa ?? null
      }));

      res.json({ ok: true, data: proyectos });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async getById(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) {
      return res.status(400).json({ ok: false, msg: "El id de proyecto debe ser un número" });
    }

    try {
      let proyecto = await prisma.proyectos.findFirst({
        where: { AND: [{ proyecto_id: idNum }, { fecha_eliminacion: null }] },
        include: {
          clientes: { select: { nombre_empresa: true } }
        }
      });

      if (!proyecto) {
        return res.status(404).json({ ok: false, msg: `No se encontró el proyecto con id: ${idNum}` });
      }

      proyecto = { ...proyecto, cliente_nombre: proyecto.clientes?.nombre_empresa ?? null };

      res.json({ ok: true, data: proyecto });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server Error, something went wrong" });
    }
  }

  static async create(req, res) {
    const {
      cliente_id,
      nombre_proyecto,
      descripcion,
      ubicacion,
      fecha_inicio,
      fecha_fin,
      presupuesto_total,
      estado
    } = req.body;

    if (!cliente_id || !nombre_proyecto || !fecha_inicio || presupuesto_total === undefined || !estado) {
      return res.status(400).json({ ok: false, msg: "Faltan campos obligatorios (cliente_id, nombre_proyecto, fecha_inicio, presupuesto_total, estado)" });
    }

    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ ok: false, msg: `Estado inválido. Válidos: ${ESTADOS_VALIDOS.join(", ")}` });
    }

    const monto = Number(presupuesto_total);
    if (Number.isNaN(monto) || monto < 0) {
      return res.status(400).json({ ok: false, msg: "El presupuesto_total debe ser un número mayor o igual a 0" });
    }

    const fInicio = new Date(fecha_inicio);
    if (isNaN(fInicio.getTime())) {
      return res.status(400).json({ ok: false, msg: "fecha_inicio no es una fecha válida" });
    }

    let fFin = null;
    if (fecha_fin !== undefined && fecha_fin !== null && fecha_fin !== "") {
      fFin = new Date(fecha_fin);
      if (isNaN(fFin.getTime())) {
        return res.status(400).json({ ok: false, msg: "fecha_fin no es una fecha válida" });
      }
      if (fFin < fInicio) {
        return res.status(400).json({ ok: false, msg: "fecha_fin no puede ser menor que fecha_inicio" });
      }
    }

    const clienteOk = await prisma.clientes.findFirst({
      where: { AND: [{ cliente_id }, { fecha_eliminacion: null }] }
    });
    if (!clienteOk) {
      return res.status(400).json({ ok: false, msg: "El cliente especificado no existe o fue dado de baja" });
    }

    try {
      let proyecto = await prisma.proyectos.create({
        data: {
          cliente_id,
          nombre_proyecto,
          descripcion: descripcion ?? null,
          ubicacion: ubicacion ?? null,
          fecha_inicio: fInicio,
          fecha_fin: fFin,
          presupuesto_total: monto,
          estado
        }
      });

      proyecto = await prisma.proyectos.findUnique({
        where: { proyecto_id: proyecto.proyecto_id },
        include: { clientes: { select: { nombre_empresa: true } } }
      });

      proyecto = { ...proyecto, cliente_nombre: proyecto.clientes?.nombre_empresa ?? null };

      res.status(201).json({ ok: true, msg: "Proyecto creado correctamente", data: proyecto });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) {
      return res.status(400).json({ ok: false, msg: "El id de proyecto debe ser un número" });
    }

    const old = await prisma.proyectos.findUnique({ where: { proyecto_id: idNum } });
    if (!old || old.fecha_eliminacion !== null) {
      return res.status(404).json({ ok: false, msg: "No se encontró el proyecto que se desea modificar" });
    }

    const {
      cliente_id,
      nombre_proyecto,
      descripcion,
      ubicacion,
      fecha_inicio,
      fecha_fin,
      presupuesto_total,
      estado
    } = req.body;

    if (estado !== undefined && !ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ ok: false, msg: `Estado inválido. Válidos: ${ESTADOS_VALIDOS.join(", ")}` });
    }

    let monto = old.presupuesto_total;
    if (presupuesto_total !== undefined) {
      monto = Number(presupuesto_total);
      if (Number.isNaN(monto) || monto < 0) {
        return res.status(400).json({ ok: false, msg: "El presupuesto_total debe ser un número mayor o igual a 0" });
      }
    }

    const nuevaFechaInicio = fecha_inicio ? new Date(fecha_inicio) : old.fecha_inicio;
    if (fecha_inicio && isNaN(nuevaFechaInicio.getTime())) {
      return res.status(400).json({ ok: false, msg: "fecha_inicio no es una fecha válida" });
    }

    const nuevaFechaFin = (fecha_fin !== undefined)
      ? (fecha_fin === null || fecha_fin === "" ? null : new Date(fecha_fin))
      : old.fecha_fin;

    if (fecha_fin !== undefined && nuevaFechaFin !== null && isNaN(nuevaFechaFin.getTime())) {
      return res.status(400).json({ ok: false, msg: "fecha_fin no es una fecha válida" });
    }
    if (nuevaFechaFin !== null && nuevaFechaFin < nuevaFechaInicio) {
      return res.status(400).json({ ok: false, msg: "fecha_fin no puede ser menor que fecha_inicio" });
    }

    let nuevoClienteId = old.cliente_id;
    if (cliente_id !== undefined) {
      if (!cliente_id) {
        return res.status(400).json({ ok: false, msg: "cliente_id no puede ser vacío" });
      }
      const clienteOk = await prisma.clientes.findFirst({
        where: { AND: [{ cliente_id }, { fecha_eliminacion: null }] }
      });
      if (!clienteOk) {
        return res.status(400).json({ ok: false, msg: "El cliente especificado no existe o fue dado de baja" });
      }
      nuevoClienteId = cliente_id;
    }

    try {
      let proyecto = await prisma.proyectos.update({
        where: { proyecto_id: idNum },
        data: {
          cliente_id: nuevoClienteId,
          nombre_proyecto: nombre_proyecto ?? old.nombre_proyecto,
          descripcion: descripcion ?? old.descripcion,
          ubicacion: ubicacion ?? old.ubicacion,
          fecha_inicio: nuevaFechaInicio,
          fecha_fin: nuevaFechaFin,
          presupuesto_total: monto,
          estado: estado ?? old.estado,
          fecha_actualizacion: new Date()
        }
      });

      proyecto = await prisma.proyectos.findUnique({
        where: { proyecto_id: proyecto.proyecto_id },
        include: { clientes: { select: { nombre_empresa: true } } }
      });

      proyecto = { ...proyecto, cliente_nombre: proyecto.clientes?.nombre_empresa ?? null };

      res.json({ ok: true, msg: "Proyecto actualizado correctamente", data: proyecto });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) {
      return res.status(400).json({ ok: false, msg: "El id de proyecto debe ser un número" });
    }

    const existe = await prisma.proyectos.findFirst({
      where: { AND: [{ proyecto_id: idNum }, { fecha_eliminacion: null }] }
    });
    if (!existe) {
      return res.status(404).json({ ok: false, msg: "No se encontró el proyecto que se desea eliminar" });
    }

    try {
      const { proyecto_id } = await prisma.proyectos.update({
        where: { proyecto_id: idNum },
        data: { fecha_eliminacion: new Date() }
      });

      res.json({ ok: true, msg: "Se eliminó el proyecto correctamente", id: proyecto_id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }
}
