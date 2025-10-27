//Listo
import prisma from "../database.js";

export default class DetallesServiciosController {
  static async getAll(_req, res) {
    try {
      const detalles = await prisma.$queryRawUnsafe(`
        SELECT 
          ds.detalle_servicio_id,
          ds.servicio_id,
          ds.producto_id,
          ds.descripcion,
          ds.cantidad,
          ds.unidad_de_medida,
          ds.precio_unitario,
          ds.subtotal,  
          ds.estado,
          ds.fecha_uso,
          ds.observaciones,
          ds.fecha_creacion,
          ds.fecha_actualizacion,
          ds.fecha_eliminacion
        FROM detalles_servicios ds
        WHERE ds.fecha_eliminacion IS NULL
        ORDER BY ds.detalle_servicio_id ASC
      `);

      res.json({ ok: true, data: detalles });
    } catch (error) {
      console.error("❌ Error en getAll:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al obtener los detalles de servicios.",
      });
    }
  }

  static async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ ok: false, msg: "El ID debe ser un número." });

      const [detalle] = await prisma.$queryRawUnsafe(`
        SELECT 
          ds.detalle_servicio_id,
          ds.servicio_id,
          ds.producto_id,
          ds.descripcion,
          ds.cantidad,
          ds.unidad_de_medida,
          ds.precio_unitario,
          ds.subtotal,  
          ds.estado,
          ds.fecha_uso,
          ds.observaciones,
          ds.fecha_creacion,
          ds.fecha_actualizacion,
          ds.fecha_eliminacion
        FROM detalles_servicios ds
        WHERE ds.detalle_servicio_id = ${id}
        AND ds.fecha_eliminacion IS NULL
      `);

      if (!detalle)
        return res.status(404).json({
          ok: false,
          msg: `No se encontró el detalle de servicio con ID ${id}`,
        });

      res.json({ ok: true, data: detalle });
    } catch (error) {
      console.error("Error en getById:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al obtener el detalle.",
      });
    }
  }

  static async create(req, res) {
    try {
      const {
        servicio_id,
        producto_id,
        descripcion,
        cantidad,
        unidad_de_medida,
        precio_unitario,
        estado,
        fecha_uso,
        observaciones,
      } = req.body;

      if (!servicio_id || !producto_id || !cantidad || !unidad_de_medida || !precio_unitario) {
        return res.status(400).json({
          ok: false,
          msg: "Campos obligatorios: servicio_id, producto_id, cantidad, unidad_de_medida y precio_unitario.",
        });
      }

      const servicio = await prisma.servicios.findUnique({
        where: { servicio_id: parseInt(servicio_id) },
      });
      if (!servicio)
        return res.status(400).json({ ok: false, msg: "El servicio especificado no existe." });

      const producto = await prisma.productos.findUnique({
        where: { producto_id: parseInt(producto_id) },
      });
      if (!producto)
        return res.status(400).json({ ok: false, msg: "El producto especificado no existe." });

      const nuevoDetalle = await prisma.detalles_servicios.create({
        data: {
          servicio_id: parseInt(servicio_id),
          producto_id: parseInt(producto_id),
          descripcion: descripcion?.trim() || null,
          cantidad: parseInt(cantidad),
          unidad_de_medida: unidad_de_medida.trim(),
          precio_unitario: parseFloat(precio_unitario),
          estado: estado?.trim() || null,
          fecha_uso: fecha_uso ? new Date(fecha_uso) : null,
          observaciones: observaciones?.trim() || null,
        },
      });

      res.status(201).json({
        ok: true,
        msg: "Detalle de servicio creado correctamente.",
        data: nuevoDetalle,
      });
    } catch (error) {
      console.error("❌ Error en create:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al crear el detalle de servicio.",
      });
    }
  }

 static async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ ok: false, msg: "El ID debe ser un número." });

      const existente = await prisma.detalles_servicios.findUnique({
        where: { detalle_servicio_id: id },
      });
      if (!existente || existente.fecha_eliminacion)
        return res.status(404).json({
          ok: false,
          msg: "El detalle no existe o ya fue eliminado.",
        });

      const {
        servicio_id,
        producto_id,
        descripcion,
        cantidad,
        unidad_de_medida,
        precio_unitario,
        estado,
        fecha_uso,
        observaciones,
      } = req.body;

      await prisma.detalles_servicios.update({
        where: { detalle_servicio_id: id },
        data: {
          servicio_id: servicio_id ? parseInt(servicio_id) : existente.servicio_id,
          producto_id: producto_id ? parseInt(producto_id) : existente.producto_id,
          descripcion: descripcion?.trim() ?? existente.descripcion,
          cantidad: cantidad ? parseInt(cantidad) : existente.cantidad,
          unidad_de_medida: unidad_de_medida?.trim() ?? existente.unidad_de_medida,
          precio_unitario: precio_unitario
            ? parseFloat(precio_unitario)
            : existente.precio_unitario,
          estado: estado?.trim() ?? existente.estado,
          fecha_uso: fecha_uso ? new Date(fecha_uso) : existente.fecha_uso,
          observaciones: observaciones?.trim() ?? existente.observaciones,
          fecha_actualizacion: new Date(),
        },
      });

      const detalle = await prisma.$queryRawUnsafe(
        `SELECT * FROM detalles_servicios WHERE detalle_servicio_id = ${id}`
      );

      res.json({
        ok: true,
        msg: "Detalle de servicio actualizado correctamente.",
        data: detalle[0],
      });
    } catch (error) {
      console.error("❌ Error en update:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al actualizar el detalle.",
      });
    }
  }

  static async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ ok: false, msg: "El ID debe ser un número." });

      const existente = await prisma.detalles_servicios.findUnique({
        where: { detalle_servicio_id: id },
      });
      if (!existente || existente.fecha_eliminacion)
        return res.status(404).json({
          ok: false,
          msg: "El detalle no existe o ya fue eliminado.",
        });

      await prisma.detalles_servicios.update({
        where: { detalle_servicio_id: id },
        data: { fecha_eliminacion: new Date() },
      });

      res.json({ ok: true, msg: "Detalle de servicio eliminado correctamente." });
    } catch (error) {
      console.error("❌ Error en delete:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al eliminar el detalle.",
      });
    }
  }
}
