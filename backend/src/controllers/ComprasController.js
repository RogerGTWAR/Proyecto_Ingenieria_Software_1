import prisma from "../database.js";

async function recalcularMontoTotal(compraId) {
  const detalles = await prisma.detalles_compras.findMany({
    where: { compra_id: compraId, fecha_eliminacion: null },
    select: { cantidad: true, precio_unitario: true }
  });

  const total = detalles.reduce(
    (sum, d) => sum + Number(d.cantidad) * Number(d.precio_unitario),
    0
  );

  await prisma.compras.update({
    where: { compra_id: compraId },
    data: { monto_total: total }
  });

  return total;
}

export default class ComprasController {
  static async getAll(_req, res) {
    try {
      const compras = await prisma.compras.findMany({
        where: { fecha_eliminacion: null },
        include: {
          proveedores: { select: { nombre_empresa: true } },
          empleados: { select: { nombres: true, apellidos: true } }
        },
        orderBy: { compra_id: "asc" }
      });

      const list = compras.map(c => ({
        ...c,
        proveedorNombre: c.proveedores?.nombre_empresa ?? "—",
        empleadoNombre: c.empleados
          ? `${c.empleados.nombres} ${c.empleados.apellidos}`
          : "—"
      }));

      res.json({ ok: true, data: list });
    } catch (error) {
      res.status(500).json({ ok: false, msg: "Error interno al obtener compras." });
    }
  }

  static async getById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ ok: false, msg: "ID inválido" });

      const compra = await prisma.compras.findFirst({
        where: { compra_id: id, fecha_eliminacion: null },
        include: {
          proveedores: { select: { nombre_empresa: true } },
          empleados: { select: { nombres: true, apellidos: true } },
          detalles_compras: {
            where: { fecha_eliminacion: null },
            include: {
              materiales: {
                select: { nombre_material: true, unidad_de_medida: true }
              }
            }
          }
        }
      });

      if (!compra) return res.status(404).json({ ok: false, msg: "Compra no encontrada" });

      const data = {
        ...compra,
        proveedorNombre: compra.proveedores?.nombre_empresa ?? "—",
        empleadoNombre: compra.empleados
          ? `${compra.empleados.nombres} ${compra.empleados.apellidos}`
          : "—"
      };

      res.json({ ok: true, data });
    } catch (error) {
      res.status(500).json({ ok: false, msg: "Error interno al obtener compra." });
    }
  }

  static async create(req, res) {
    try {
      const { proveedor_id, empleado_id, numero_factura, fecha_compra, estado, observaciones } =
        req.body;

      if (!proveedor_id || !numero_factura || !estado)
        return res.status(400).json({ ok: false, msg: "Campos obligatorios faltantes" });

      const proveedor = await prisma.proveedores.findFirst({
        where: { proveedor_id: Number(proveedor_id), fecha_eliminacion: null }
      });
      if (!proveedor)
        return res.status(400).json({ ok: false, msg: "Proveedor no existe" });

      let empleadoValido = null;
      if (empleado_id) {
        empleadoValido = await prisma.empleados.findFirst({
          where: { empleado_id: Number(empleado_id), fecha_eliminacion: null }
        });
        if (!empleadoValido)
          return res.status(400).json({ ok: false, msg: "Empleado inválido" });
      }

      const nueva = await prisma.compras.create({
        data: {
          proveedor_id: Number(proveedor_id),
          empleado_id: empleadoValido ? empleadoValido.empleado_id : null,
          numero_factura,
          fecha_compra: fecha_compra ? new Date(fecha_compra) : new Date(),
          monto_total: 0,
          estado,
          observaciones: observaciones ?? null
        }
      });

      const total = await recalcularMontoTotal(nueva.compra_id);

      res.status(201).json({
        ok: true,
        msg: "Compra registrada correctamente",
        data: { ...nueva, monto_total: total }
      });
    } catch (error) {
      res.status(500).json({ ok: false, msg: "Error interno al crear compra" });
    }
  }

  static async update(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ ok: false, msg: "ID inválido" });

      const old = await prisma.compras.findFirst({
        where: { compra_id: id, fecha_eliminacion: null }
      });
      if (!old) return res.status(404).json({ ok: false, msg: "Compra no encontrada" });

      const { proveedor_id, empleado_id, numero_factura, fecha_compra, estado, observaciones } =
        req.body;

      const updated = await prisma.compras.update({
        where: { compra_id: id },
        data: {
          proveedor_id: proveedor_id ?? old.proveedor_id,
          empleado_id: empleado_id ?? old.empleado_id,
          numero_factura: numero_factura ?? old.numero_factura,
          fecha_compra: fecha_compra ? new Date(fecha_compra) : old.fecha_compra,
          estado: estado ?? old.estado,
          observaciones: observaciones ?? old.observaciones,
          fecha_actualizacion: new Date()
        }
      });

      const total = await recalcularMontoTotal(id);

      res.json({
        ok: true,
        msg: "Compra actualizada correctamente",
        data: { ...updated, monto_total: total }
      });
    } catch (error) {
      res.status(500).json({ ok: false, msg: "Error al actualizar compra" });
    }
  }

  static async delete(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ ok: false, msg: "ID inválido" });

      const comp = await prisma.compras.findFirst({
        where: { compra_id: id, fecha_eliminacion: null }
      });
      if (!comp) return res.status(404).json({ ok: false, msg: "Compra no encontrada" });

      await prisma.compras.update({
        where: { compra_id: id },
        data: { fecha_eliminacion: new Date() }
      });

      res.json({ ok: true, msg: "Compra eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ ok: false, msg: "Error al eliminar compra" });
    }
  }
}
