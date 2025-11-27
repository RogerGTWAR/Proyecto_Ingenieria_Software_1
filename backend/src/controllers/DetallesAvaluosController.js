import prisma from "../database.js";

const mapDetalle = (row) => {
  const cantidad = Number(row.cantidad ?? 0);
  const precioUnit = Number(row.precio_unitario ?? 0);

  const costo_venta = cantidad * precioUnit;
  const iva = costo_venta * 0.15;
  const total_costo_venta = costo_venta + iva;

  return {
    ...row,
    costo_venta: Number(costo_venta.toFixed(2)),
    iva: Number(iva.toFixed(2)),
    total_costo_venta: Number(total_costo_venta.toFixed(2)),
  };
};

async function recalcularMontoEjecutado(avaluo_id) {
  const detalles = await prisma.detalles_avaluos.findMany({
    where: { avaluo_id, fecha_eliminacion: null },
  });

  let total = 0;
  for (const d of detalles) {
    const m = mapDetalle(d);
    total += m.total_costo_venta;
  }

  await prisma.avaluos.update({
    where: { avaluo_id },
    data: { monto_ejecutado: total },
  });
}

export default class DetallesAvaluosController {

  static async getAll(_req, res) {
    try {
      const data = await prisma.detalles_avaluos.findMany({
        where: { fecha_eliminacion: null },
        include: {
          Servicios: true,
          Avaluos: true,
        },
        orderBy: { detalle_avaluo_id: "asc" },
      });

      res.json({ ok: true, data: data.map(mapDetalle) });

    } catch (error) {
      console.error("Error getAll:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno al obtener detalles del avalúo.",
      });
    }
  }

  static async getById(req, res) {
    const id = Number(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ ok: false, msg: "ID inválido." });

    try {
      const detalle = await prisma.detalles_avaluos.findFirst({
        where: { detalle_avaluo_id: id, fecha_eliminacion: null },
        include: {
          Servicios: true,
          Avaluos: true,
        },
      });

      if (!detalle)
        return res.status(404).json({ ok: false, msg: "No encontrado." });

      res.json({ ok: true, data: mapDetalle(detalle) });

    } catch (error) {
      console.error("Error getById:", error);
      res.status(500).json({ ok: false, msg: "Error interno." });
    }
  }

  static async create(req, res) {
    try {
      const {
        avaluo_id,
        servicio_id,
        actividad,
        unidad_de_medida,
        cantidad,
      } = req.body;

      if (!avaluo_id || !servicio_id || !actividad || !unidad_de_medida || !cantidad)
        return res.status(400).json({
          ok: false,
          msg: "Campos obligatorios faltantes.",
        });

      const dup = await prisma.detalles_avaluos.findFirst({
        where: {
          avaluo_id: Number(avaluo_id),
          servicio_id: Number(servicio_id),
          fecha_eliminacion: null,
        },
      });

      if (dup) {
        return res.status(409).json({
          ok: false,
          msg: "Este servicio ya está asignado a este avalúo.",
        });
      }

      const serv = await prisma.servicios.findFirst({
        where: { servicio_id: Number(servicio_id), fecha_eliminacion: null },
      });

      if (!serv)
        return res.status(400).json({
          ok: false,
          msg: "El servicio no existe.",
        });

      const precio_unitario =
        Number(serv.total_costo_directo) + Number(serv.total_costo_indirecto);

      const nuevo = await prisma.detalles_avaluos.create({
        data: {
          avaluo_id: Number(avaluo_id),
          servicio_id: Number(servicio_id),
          actividad,
          unidad_de_medida,
          cantidad: Number(cantidad),
          precio_unitario,
        },
      });

      await recalcularMontoEjecutado(Number(avaluo_id));

      res.status(201).json({
        ok: true,
        msg: "Detalle agregado.",
        data: mapDetalle(nuevo),
      });

    } catch (error) {
      console.error("Error create:", error);
      res.status(500).json({ ok: false, msg: "Error interno al crear." });
    }
  }

  static async update(req, res) {
    try {
      const id = Number(req.params.id);

      const old = await prisma.detalles_avaluos.findFirst({
        where: { detalle_avaluo_id: id, fecha_eliminacion: null },
      });

      if (!old)
        return res.status(404).json({ ok: false, msg: "No encontrado." });

      const {
        servicio_id,
        actividad,
        unidad_de_medida,
        cantidad,
      } = req.body;

      let precio_unitario = old.precio_unitario;

      if (servicio_id && Number(servicio_id) !== old.servicio_id) {

        const dup = await prisma.detalles_avaluos.findFirst({
          where: {
            avaluo_id: old.avaluo_id,
            servicio_id: Number(servicio_id),
            fecha_eliminacion: null,
          },
        });

        if (dup) {
          return res.status(409).json({
            ok: false,
            msg: "Ese servicio ya está asignado a este avalúo.",
          });
        }

        const serv = await prisma.servicios.findFirst({
          where: { servicio_id: Number(servicio_id), fecha_eliminacion: null },
        });

        if (serv) {
          precio_unitario =
            Number(serv.total_costo_directo) + Number(serv.total_costo_indirecto);
        }
      }

      const upd = await prisma.detalles_avaluos.update({
        where: { detalle_avaluo_id: id },
        data: {
          servicio_id: servicio_id ? Number(servicio_id) : old.servicio_id,
          actividad: actividad ?? old.actividad,
          unidad_de_medida: unidad_de_medida ?? old.unidad_de_medida,
          cantidad:
            cantidad !== undefined ? Number(cantidad) : old.cantidad,
          precio_unitario,
          fecha_actualizacion: new Date(),
        },
      });

      await recalcularMontoEjecutado(upd.avaluo_id);

      res.json({
        ok: true,
        msg: "Actualizado correctamente.",
        data: mapDetalle(upd),
      });

    } catch (error) {
      console.error("Error update:", error);
      res.status(500).json({ ok: false, msg: "Error al actualizar." });
    }
  }

  static async delete(req, res) {
    try {
      const id = Number(req.params.id);

      const old = await prisma.detalles_avaluos.findFirst({
        where: { detalle_avaluo_id: id, fecha_eliminacion: null },
      });

      if (!old)
        return res.status(404).json({
          ok: false,
          msg: "No encontrado.",
        });

      await prisma.detalles_avaluos.update({
        where: { detalle_avaluo_id: id },
        data: { fecha_eliminacion: new Date() },
      });

      await recalcularMontoEjecutado(old.avaluo_id);

      res.json({ ok: true, msg: "Eliminado correctamente." });

    } catch (error) {
      console.error("Error delete:", error);
      res.status(500).json({ ok: false, msg: "Error al eliminar." });
    }
  }
}
