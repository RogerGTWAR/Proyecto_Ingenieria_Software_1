import prisma from "../database.js";

export default class ServiciosController {
  static async getAll(_req, res) {
    try {
      const servicios = await prisma.$queryRawUnsafe(`
        SELECT 
          s.servicio_id,
          s.nombre_servicio,
          s.descripcion,
          s.precio_unitario,
          s.cantidad,
          (s.precio_unitario * s.cantidad) AS total,
          s.unidad_de_medida,
          s.estado,
          s.fecha_inicio,
          s.fecha_fin,
          (s.fecha_fin - s.fecha_inicio) AS tiempo_total_dias,
          s.fecha_creacion,
          s.fecha_actualizacion,
          s.fecha_eliminacion
        FROM servicios s
        WHERE s.fecha_eliminacion IS NULL
        ORDER BY s.servicio_id ASC;
      `);

      res.json({ ok: true, data: servicios });
    } catch (error) {
      console.error("❌ Error en getAll:", error);
      res.status(500).json({ ok: false, msg: "Error interno al obtener los servicios." });
    }
  }

  static async getById(req, res) {
    try {
      const idNum = parseInt(req.params.id);
      if (isNaN(idNum))
        return res.status(400).json({ ok: false, msg: "El ID debe ser un número válido." });

      const [servicio] = await prisma.$queryRawUnsafe(`
        SELECT 
          s.servicio_id,
          s.nombre_servicio,
          s.descripcion,
          s.precio_unitario,
          s.cantidad,
          (s.precio_unitario * s.cantidad) AS total,
          s.unidad_de_medida,
          s.estado,
          s.fecha_inicio,
          s.fecha_fin,
          (s.fecha_fin - s.fecha_inicio) AS tiempo_total_dias,
          s.fecha_creacion,
          s.fecha_actualizacion,
          s.fecha_eliminacion
        FROM servicios s
        WHERE s.servicio_id = ${idNum}
        AND s.fecha_eliminacion IS NULL;
      `);

      if (!servicio)
        return res.status(404).json({ ok: false, msg: `No se encontró el servicio con ID ${idNum}` });

      res.json({ ok: true, data: servicio });
    } catch (error) {
      console.error("❌ Error en getById:", error);
      res.status(500).json({ ok: false, msg: "Error interno al obtener el servicio." });
    }
  }

  static async create(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).json({ ok: false, msg: "El cuerpo de la petición está vacío o mal formateado." });

      const {
        nombre_servicio,
        descripcion,
        precio_unitario,
        cantidad,
        unidad_de_medida,
        estado,
        fecha_inicio,
        fecha_fin,
      } = req.body;

      if (!nombre_servicio || precio_unitario == null || cantidad == null || !unidad_de_medida)
        return res.status(400).json({ ok: false, msg: "Campos obligatorios: nombre_servicio, precio_unitario, cantidad y unidad_de_medida" });

      const servicio = await prisma.servicios.create({
        data: {
          nombre_servicio: nombre_servicio.trim(),
          descripcion: descripcion?.trim() ?? null,
          precio_unitario: parseFloat(precio_unitario),
          cantidad: parseInt(cantidad),
          unidad_de_medida: unidad_de_medida.trim(),
          estado: estado?.trim() ?? "Activo",
          fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : null,
          fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
        },
      });

      res.status(201).json({ ok: true, msg: "Servicio creado correctamente", data: servicio });
    } catch (error) {
      console.error("❌ Error en create:", error);
      res.status(500).json({ ok: false, msg: "Error interno al crear el servicio." });
    }
  }

  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID debe ser un número." });

    try {
      const old = await prisma.servicios.findUnique({ where: { servicio_id: idNum } });
      if (!old || old.fecha_eliminacion !== null)
        return res.status(404).json({ ok: false, msg: "No se encontró el servicio a modificar" });

      const {
        nombre_servicio,
        descripcion,
        precio_unitario,
        cantidad,
        unidad_de_medida,
        estado,
        fecha_inicio,
        fecha_fin,
      } = req.body;

      const servicio = await prisma.servicios.update({
        where: { servicio_id: idNum },
        data: {
          nombre_servicio: nombre_servicio?.trim() ?? old.nombre_servicio,
          descripcion: descripcion?.trim() ?? old.descripcion,
          precio_unitario:
            precio_unitario != null ? parseFloat(precio_unitario) : old.precio_unitario,
          cantidad: cantidad != null ? parseInt(cantidad) : old.cantidad,
          unidad_de_medida: unidad_de_medida?.trim() ?? old.unidad_de_medida,
          estado: estado?.trim() ?? old.estado,
          fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : old.fecha_inicio,
          fecha_fin: fecha_fin ? new Date(fecha_fin) : old.fecha_fin,
          fecha_actualizacion: new Date(),
        },
      });

      res.json({ ok: true, msg: "Servicio actualizado correctamente", data: servicio });
    } catch (error) {
      console.error("❌ Error en update:", error);
      res.status(500).json({ ok: false, msg: "Error interno al actualizar el servicio." });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID debe ser un número." });

    try {
      const existe = await prisma.servicios.findFirst({
        where: { AND: [{ servicio_id: idNum }, { fecha_eliminacion: null }] },
      });
      if (!existe)
        return res.status(404).json({ ok: false, msg: "No se encontró el servicio a eliminar" });

      const { servicio_id } = await prisma.servicios.update({
        where: { servicio_id: idNum },
        data: { fecha_eliminacion: new Date() },
      });

      res.json({ ok: true, msg: "Servicio eliminado correctamente", id: servicio_id });
    } catch (error) {
      console.error("❌ Error en delete:", error);
      res.status(500).json({ ok: false, msg: "Error interno al eliminar el servicio." });
    }
  }
}
