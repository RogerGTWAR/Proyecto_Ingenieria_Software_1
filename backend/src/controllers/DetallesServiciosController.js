import prisma from "../database.js";

export default class DetallesServiciosController {

  static async getAll(_req, res) {
    try {
      const detalles = await prisma.detalles_servicios.findMany({
        where: { fecha_eliminacion: null },
        include: {
          servicio_id_servicios: {
            select: {
              servicio_id: true,
              nombre_servicio: true,
              descripcion: true,
              precio_unitario: true,
              cantidad: true,
              unidad_de_medida: true,
              estado: true,
            }
          },
          material_id_materiales: {
            select: {
              material_id: true,
              nombre_material: true,
              unidad_de_medida: true,
              precio_unitario: true,
              cantidad_en_stock: true
            }
          }
        },
        orderBy: { detalle_servicio_id: "asc" },
      });

      const list = detalles.map(d => ({
        ...d,
        total: Number(d.precio_unitario) * Number(d.cantidad)
      }));

      res.json({ ok: true, data: list });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: "Server error, something went wrong",
      });
    }
  }

  static async getById(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID debe ser numérico" });

    try {
      const detalle = await prisma.detalles_servicios.findFirst({
        where: {
          detalle_servicio_id: idNum,
          fecha_eliminacion: null
        },
        include: {
          servicio_id_servicios: true,
          material_id_materiales: true
        }
      });

      if (!detalle)
        return res.status(404).json({ ok: false, msg: "Detalle no encontrado" });

      detalle.total =
        Number(detalle.precio_unitario) * Number(detalle.cantidad);

      res.json({ ok: true, data: detalle });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: "Server error, something went wrong",
      });
    }
  }

  static async create(req, res) {
    try {
      const {
        servicio_id,
        material_id,
        descripcion,
        cantidad,
        unidad_de_medida,
        precio_unitario
      } = req.body;

      if (!servicio_id || !material_id || !descripcion || !cantidad || !unidad_de_medida || !precio_unitario)
        return res.status(400).json({ ok: false, msg: "Faltan campos requeridos." });

      const servicioId = Number(servicio_id);
      const materialId = Number(material_id);

      const servOk = await prisma.servicios.findFirst({
        where: { servicio_id: servicioId, fecha_eliminacion: null }
      });

      if (!servOk)
        return res.status(400).json({ ok: false, msg: "El servicio indicado no existe." });

      const matOk = await prisma.materiales.findFirst({
        where: { material_id: materialId, fecha_eliminacion: null }
      });

      if (!matOk)
        return res.status(400).json({ ok: false, msg: "El material indicado no existe." });

      const previo = await prisma.detalles_servicios.findFirst({
        where: { servicio_id: servicioId, material_id: materialId }
      });

      if (previo && previo.fecha_eliminacion !== null) {
        const reactivado = await prisma.detalles_servicios.update({
          where: { detalle_servicio_id: previo.detalle_servicio_id },
          data: {
            fecha_eliminacion: null,
            descripcion,
            cantidad,
            unidad_de_medida,
            precio_unitario: Number(precio_unitario),
            fecha_actualizacion: new Date()
          },
          include: {
            servicio_id_servicios: true,
            material_id_materiales: true
          }
        });

        return res.json({
          ok: true,
          msg: "Detalle reactivado",
          data: {
            ...reactivado,
            total: Number(reactivado.cantidad) * Number(reactivado.precio_unitario)
          }
        });
      }

      if (previo && previo.fecha_eliminacion === null)
        return res.json({ ok: true, msg: "El detalle ya existe", data: previo });

      const nuevo = await prisma.detalles_servicios.create({
        data: {
          servicio_id: servicioId,
          material_id: materialId,
          descripcion,
          cantidad,
          unidad_de_medida,
          precio_unitario: Number(precio_unitario)
        },
        include: {
          servicio_id_servicios: true,
          material_id_materiales: true
        }
      });

      res.status(201).json({
        ok: true,
        msg: "Detalle creado correctamente",
        data: {
          ...nuevo,
          total: Number(nuevo.cantidad) * Number(nuevo.precio_unitario)
        }
      });

    } catch (error) {
      console.error("❌ Error create:", error);
      res.status(500).json({ ok: false, msg: "Error interno al crear el detalle." });
    }
  }

  static async update(req, res) {
    try {
      const id = Number(req.params.id);

      const existente = await prisma.detalles_servicios.findUnique({
        where: { detalle_servicio_id: id }
      });

      if (!existente || existente.fecha_eliminacion !== null)
        return res.status(404).json({ ok: false, msg: "El detalle no existe o ya fue eliminado" });

      const {
        servicio_id,
        material_id,
        descripcion,
        cantidad,
        unidad_de_medida,
        precio_unitario
      } = req.body;

      const actualizado = await prisma.detalles_servicios.update({
        where: { detalle_servicio_id: id },
        data: {
          servicio_id: servicio_id ? Number(servicio_id) : existente.servicio_id,
          material_id: material_id ? Number(material_id) : existente.material_id,
          descripcion: descripcion ?? existente.descripcion,
          cantidad: cantidad ?? existente.cantidad,
          unidad_de_medida: unidad_de_medida ?? existente.unidad_de_medida,
          precio_unitario: precio_unitario
            ? Number(precio_unitario)
            : existente.precio_unitario,
          fecha_actualizacion: new Date()
        },
        include: {
          servicio_id_servicios: true,
          material_id_materiales: true
        }
      });

      res.json({
        ok: true,
        msg: "Detalle actualizado",
        data: {
          ...actualizado,
          total: Number(actualizado.cantidad) * Number(actualizado.precio_unitario)
        }
      });

    } catch (error) {
      console.error("❌ Error update:", error);
      res.status(500).json({ ok: false, msg: "Error interno al actualizar" });
    }
  }

  static async delete(req, res) {
    try {
      const id = parseInt(req.params.id);

      const existe = await prisma.detalles_servicios.findFirst({
        where: { detalle_servicio_id: id, fecha_eliminacion: null }
      });

      if (!existe)
        return res.status(404).json({ ok: false, msg: "No se encontró el detalle a eliminar" });

      await prisma.detalles_servicios.update({
        where: { detalle_servicio_id: id },
        data: { fecha_eliminacion: new Date() }
      });

      res.json({ ok: true, msg: "Detalle eliminado correctamente" });

    } catch (error) {
      console.error("❌ Error delete:", error);
      res.status(500).json({ ok: false, msg: "Error interno al eliminar" });
    }
  }
}
