// ✅ AvaluosController.js
import prisma from "../database.js";

export default class AvaluosController {
  // 🔹 Obtener todos los avalúos
  static async getAll(_req, res) {
    try {
      const avaluos = await prisma.$queryRawUnsafe(`
        SELECT 
          a.avaluo_id,
          a.proyecto_id,
          a.descripcion,
          a.monto_ejecutado,
          a.fecha_inicio,
          a.fecha_fin,
          (a.fecha_fin::date - a.fecha_inicio::date) AS tiempo_total_dias,
          a.fecha_creacion,
          a.fecha_actualizacion,
          a.fecha_eliminacion,
          p.nombre_proyecto,
          p.estado
        FROM avaluos a
        JOIN proyectos p ON a.proyecto_id = p.proyecto_id
        WHERE a.fecha_eliminacion IS NULL
        ORDER BY a.avaluo_id ASC;
      `);

      res.json({ ok: true, data: avaluos });
    } catch (error) {
      console.error("❌ Error en getAll:", error);
      res.status(500).json({ ok: false, msg: "Error interno del servidor al obtener los avalúos." });
    }
  }

  // 🔹 Obtener avalúo por ID
  static async getById(req, res) {
    try {
      const idNum = parseInt(req.params.id);
      if (isNaN(idNum))
        return res.status(400).json({ ok: false, msg: "El ID del avalúo debe ser numérico." });

      const [avaluo] = await prisma.$queryRawUnsafe(`
        SELECT 
          a.avaluo_id,
          a.proyecto_id,
          a.descripcion,
          a.monto_ejecutado,
          a.fecha_inicio,
          a.fecha_fin,
          (a.fecha_fin::date - a.fecha_inicio::date) AS tiempo_total_dias,
          a.fecha_creacion,
          a.fecha_actualizacion,
          a.fecha_eliminacion,
          p.nombre_proyecto,
          p.estado
        FROM avaluos a
        JOIN proyectos p ON a.proyecto_id = p.proyecto_id
        WHERE a.avaluo_id = ${idNum}
        AND a.fecha_eliminacion IS NULL;
      `);

      if (!avaluo)
        return res.status(404).json({ ok: false, msg: `No se encontró el avalúo con ID: ${idNum}` });

      res.json({ ok: true, data: avaluo });
    } catch (error) {
      console.error("❌ Error en getById:", error);
      res.status(500).json({ ok: false, msg: "Error interno al obtener el avalúo." });
    }
  }

  // 🔹 Crear avalúo
  static async create(req, res) {
    try {
      const { proyecto_id, descripcion, monto_ejecutado, fecha_inicio, fecha_fin } = req.body;

      if (!proyecto_id || !monto_ejecutado || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          ok: false,
          msg: "Campos obligatorios: proyecto_id, monto_ejecutado, fecha_inicio y fecha_fin",
        });
      }

      // ✅ Verificar proyecto válido
      const proy = await prisma.proyectos.findFirst({
        where: { proyecto_id: parseInt(proyecto_id), fecha_eliminacion: null },
      });
      if (!proy) {
        return res.status(400).json({ ok: false, msg: "El proyecto especificado no existe o fue eliminado." });
      }

      // ✅ Limpieza de formato numérico
      const monto = Number(String(monto_ejecutado).replace(/,/g, "").trim());
      if (isNaN(monto) || monto < 0) {
        return res.status(400).json({ ok: false, msg: "El monto ejecutado debe ser un número válido." });
      }

      const avaluo = await prisma.avaluos.create({
        data: {
          proyecto_id: parseInt(proyecto_id),
          descripcion: descripcion?.trim() ?? null,
          monto_ejecutado: monto,
          fecha_inicio: new Date(fecha_inicio),
          fecha_fin: new Date(fecha_fin),
        },
      });

      res.status(201).json({ ok: true, msg: "Avalúo creado correctamente.", data: avaluo });
    } catch (error) {
      console.error("❌ Error en create:", error);
      res.status(500).json({ ok: false, msg: "Error interno del servidor al crear el avalúo." });
    }
  }

  // 🔹 Actualizar avalúo
  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID debe ser numérico." });

    try {
      const old = await prisma.avaluos.findUnique({ where: { avaluo_id: idNum } });
      if (!old || old.fecha_eliminacion !== null)
        return res.status(404).json({ ok: false, msg: "No se encontró el avalúo a modificar." });

      const { proyecto_id, descripcion, monto_ejecutado, fecha_inicio, fecha_fin } = req.body;

      let proyectoId = old.proyecto_id;
      if (proyecto_id) {
        const proy = await prisma.proyectos.findFirst({
          where: { proyecto_id: parseInt(proyecto_id), fecha_eliminacion: null },
        });
        if (!proy)
          return res.status(400).json({ ok: false, msg: "El proyecto especificado no existe." });
        proyectoId = parseInt(proyecto_id);
      }

      const monto =
        monto_ejecutado != null
          ? Number(String(monto_ejecutado).replace(/,/g, "").trim())
          : old.monto_ejecutado;

      const avaluo = await prisma.avaluos.update({
        where: { avaluo_id: idNum },
        data: {
          proyecto_id: proyectoId,
          descripcion: descripcion?.trim() ?? old.descripcion,
          monto_ejecutado: monto,
          fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : old.fecha_inicio,
          fecha_fin: fecha_fin ? new Date(fecha_fin) : old.fecha_fin,
          fecha_actualizacion: new Date(),
        },
      });

      res.json({ ok: true, msg: "Avalúo actualizado correctamente.", data: avaluo });
    } catch (error) {
      console.error("❌ Error en update:", error);
      res.status(500).json({ ok: false, msg: "Error interno al actualizar el avalúo." });
    }
  }

  // 🔹 Eliminar avalúo
  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID debe ser numérico." });

    try {
      const existe = await prisma.avaluos.findFirst({
        where: { avaluo_id: idNum, fecha_eliminacion: null },
      });
      if (!existe)
        return res.status(404).json({ ok: false, msg: "No se encontró el avalúo a eliminar." });

      await prisma.avaluos.update({
        where: { avaluo_id: idNum },
        data: { fecha_eliminacion: new Date() },
      });

      res.json({ ok: true, msg: "Avalúo eliminado correctamente." });
    } catch (error) {
      console.error("❌ Error en delete:", error);
      res.status(500).json({ ok: false, msg: "Error interno al eliminar el avalúo." });
    }
  }
}
