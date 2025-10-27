//Falta-En Revision
import prisma from "../database.js";

const ESTADOS_PERMITIDOS = ['Pendiente', 'Pagada', 'Cancelada'];

export default class ComprasController {
  static async getAll(_req, res) {
    try {
      const compras = await prisma.compras.findMany({
        where: { fecha_eliminacion: null },
        include: {
          proveedores: { select: { proveedor_id: true, nombre_proveedor: true } },
          empleados: { select: { empleado_id: true, nombres: true, apellidos: true } }
        },
        orderBy: { compra_id: "asc" }
      });

      const data = compras.map(c => ({
        ...c,
        proveedor: c.proveedores?.nombre_proveedor ?? null,
        empleado: c.empleados ? `${c.empleados.nombres} ${c.empleados.apellidos}` : null
      }));

      res.json({ ok: true, data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async getById(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id de la compra debe ser un número" });

    try {
      const compra = await prisma.compras.findFirst({
        where: { AND: [{ compra_id: idNum }, { fecha_eliminacion: null }] },
        include: {
          proveedores: { select: { proveedor_id: true, nombre_proveedor: true } },
          empleados: { select: { empleado_id: true, nombres: true, apellidos: true } }
        }
      });

      if (!compra) return res.status(404).json({ ok: false, msg: `No se encontró la compra con id: ${idNum}` });

      res.json({
        ok: true,
        data: { ...compra, proveedor: compra.proveedores?.nombre_proveedor ?? null, empleado: compra.empleados ? `${compra.empleados.nombres} ${compra.empleados.apellidos}` : null }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server Error, something went wrong" });
    }
  }

  static async create(req, res) {
    const {
      proveedor_id,
      empleado_id,
      numero_factura,
      monto_total,
      estado,
      observaciones
    } = req.body;

    if (proveedor_id === undefined || !numero_factura || monto_total === undefined || estado === undefined) {
      return res.status(400).json({ ok: false, msg: "Faltan campos obligatorios: proveedor_id, numero_factura, monto_total y estado" });
    }

    const monto = Number(monto_total);
    if (isNaN(monto) || monto < 0) {
      return res.status(400).json({ ok: false, msg: "monto_total debe ser un número >= 0" });
    }

    if (!ESTADOS_PERMITIDOS.includes(estado)) {
      return res.status(400).json({ ok: false, msg: `estado inválido. Valores permitidos: ${ESTADOS_PERMITIDOS.join(", ")}` });
    }

    const provOk = await prisma.proveedores.findFirst({
      where: { AND: [{ proveedor_id: proveedor_id }, { fecha_eliminacion: null }] }
    });
    if (!provOk) return res.status(400).json({ ok: false, msg: "El proveedor no existe o fue dado de baja" });

    if (empleado_id !== null) {
      const empOk = await prisma.empleados.findFirst({
        where: { AND: [{ empleado_id: empleado_id }, { fecha_eliminacion: null }] }
      });
      if (!empOk) return res.status(400).json({ ok: false, msg: "El empleado no existe o fue dado de baja" });
    }

    try {
      const dup = await prisma.compras.findFirst({
        where: { AND: [{ numero_factura: numero_factura.trim() }, { fecha_eliminacion: null }] }
      });
      if (dup) {
        return res.status(400).json({ ok: false, msg: "Ya existe una compra activa con ese número de factura" });
      }

      const nueva = await prisma.compras.create({
        data: {
          proveedor_id,
          empleado_id: empleado_id || null,
          numero_factura: numero_factura.trim(),
          monto_total: monto,
          estado,
          observaciones: observaciones?.trim() ?? null
        },
        include: {
          proveedores: { select: { proveedor_id: true, nombre_proveedor: true } },
          empleados: { select: { empleado_id: true, nombres: true, apellidos: true } }
        }
      });

      res.status(201).json({
        ok: true,
        msg: "Compra creada correctamente",
        data: { ...nueva, proveedor: nueva.proveedores?.nombre_proveedor ?? null, empleado: nueva.empleados ? `${nueva.empleados.nombres} ${nueva.empleados.apellidos}` : null }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id de la compra debe ser un número" });

    try {
      const old = await prisma.compras.findUnique({ where: { compra_id: idNum } });
      if (!old || old.fecha_eliminacion !== null) {
        return res.status(404).json({ ok: false, msg: "No se encontró la compra que se desea modificar" });
      }

      const {
        proveedor_id,
        empleado_id,
        numero_factura,
        monto_total,
        estado,
        observaciones
      } = req.body;

      let provId = old.proveedor_id;
      if (proveedor_id !== undefined) {
        const parsed = parseInt(proveedor_id);
        if (isNaN(parsed)) return res.status(400).json({ ok: false, msg: "El id del proveedor debe ser un número" });
        const provOk = await prisma.proveedores.findFirst({
          where: { AND: [{ proveedor_id: parsed }, { fecha_eliminacion: null }] }
        });
        if (!provOk) return res.status(400).json({ ok: false, msg: "El proveedor no existe o fue dado de baja" });
        provId = parsed;
      }

      let nuevoEstado = old.estado;
      if (estado !== undefined) {
        if (!ESTADOS_PERMITIDOS.includes(estado)) {
          return res.status(400).json({ ok: false, msg: `estado inválido. Valores permitidos: ${ESTADOS_PERMITIDOS.join(", ")}` });
        }
        nuevoEstado = estado;
      }

      let monto = old.monto_total;
      if (monto_total !== undefined) {
        const parsed = Number(monto_total);
        if (isNaN(parsed) || parsed < 0) {
          return res.status(400).json({ ok: false, msg: "monto_total debe ser un número >= 0" });
        }
        monto = parsed;
      }

      let empId = old.empleado_id;
      if (empleado_id !== undefined) {
        const parsed = parseInt(empleado_id);
        if (isNaN(parsed)) return res.status(400).json({ ok: false, msg: "empleado_id debe ser numérico" });
        const empOk = await prisma.empleados.findFirst({
          where: { AND: [{ empleado_id: parsed }, { fecha_eliminacion: null }] }
        });
        if (!empOk) return res.status(400).json({ ok: false, msg: "El empleado no existe o fue dado de baja" });
        empId = parsed;
      }

      const actualizado = await prisma.compras.update({
        where: { compra_id: idNum },
        data: {
          proveedor_id: provId,
          empleado_id: empId,
          numero_factura: numero_factura !== undefined ? numero_factura.trim() : old.numero_factura,
          monto_total: monto,
          estado: nuevoEstado,
          observaciones: observaciones !== undefined ? (observaciones?.trim() ?? null) : old.observaciones,
          fecha_actualizacion: new Date()
        },
        include: {
          proveedores: { select: { proveedor_id: true, nombre_proveedor: true } },
          empleados: { select: { empleado_id: true, nombres: true, apellidos: true } }
        }
      });

      res.json({
        ok: true,
        msg: "Compra actualizada correctamente",
        data: { ...actualizado, proveedor: actualizado.proveedores?.nombre_proveedor ?? null, empleado: actualizado.empleados ? `${actualizado.empleados.nombres} ${actualizado.empleados.apellidos}` : null }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id de la compra debe ser un número" });

    try {
      const existe = await prisma.compras.findFirst({
        where: { AND: [{ compra_id: idNum }, { fecha_eliminacion: null }] }
      });
      if (!existe) return res.status(404).json({ ok: false, msg: "No se encontró la compra que se desea eliminar" });

      const { compra_id } = await prisma.compras.update({
        where: { compra_id: idNum },
        data: { fecha_eliminacion: new Date() }
      });

      res.json({ ok: true, msg: "Se eliminó la compra correctamente", id: compra_id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }
}
