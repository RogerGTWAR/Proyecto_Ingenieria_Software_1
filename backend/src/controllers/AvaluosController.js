//Listo
import prisma from "../database.js";

export default class AvaluosController {
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
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al obtener los avalúos.",
      });
    }
  }

  static async getById(req, res) {
    try {
      const idNum = parseInt(req.params.id);
      if (isNaN(idNum))
        return res.status(400).json({
          ok: false,
          msg: "El ID del avalúo debe ser un número válido.",
        });

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
        return res.status(404).json({
          ok: false,
          msg: `No se encontró el avalúo con ID: ${idNum}`,
        });

      const servicios = await prisma.avaluos_servicios.findMany({
        where: { avaluo_id: idNum },
        include: {
          servicios: {
            select: {
              servicio_id: true,
              nombre_servicio: true,
              descripcion: true,
              unidad_de_medida: true,
            },
          },
        },
      });

      res.json({
        ok: true,
        data: {
          ...avaluo,
          avaluos_servicios: servicios,
        },
      });
    } catch (error) {
      console.error("❌ Error en getById:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al obtener el avalúo.",
      });
    }
  }


  static async create(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          ok: false,
          msg: "El cuerpo de la petición está vacío o mal formateado. Asegúrate de usar JSON.",
        });
      }

      const { proyecto_id, descripcion, monto_ejecutado, fecha_inicio, fecha_fin } = req.body;

      if (!proyecto_id || !monto_ejecutado || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          ok: false,
          msg: "Campos obligatorios: proyecto_id, monto_ejecutado, fecha_inicio y fecha_fin",
        });
      }

      const proy = await prisma.proyectos.findFirst({
        where: { AND: [{ proyecto_id: parseInt(proyecto_id) }, { fecha_eliminacion: null }] },
      });
      if (!proy) {
        return res
          .status(400)
          .json({ ok: false, msg: "El proyecto especificado no existe o fue eliminado" });
      }

      const avaluo = await prisma.avaluos.create({
        data: {
          proyecto_id: parseInt(proyecto_id),
          descripcion: descripcion?.trim() ?? null,
          monto_ejecutado: parseFloat(monto_ejecutado),
          fecha_inicio: new Date(fecha_inicio),
          fecha_fin: new Date(fecha_fin),
        },
      });

      res.status(201).json({ ok: true, msg: "Avalúo creado correctamente", data: avaluo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID del avalúo debe ser un número" });

    try {
      const old = await prisma.avaluos.findUnique({ where: { avaluo_id: idNum } });
      if (!old || old.fecha_eliminacion !== null)
        return res.status(404).json({ ok: false, msg: "No se encontró el avalúo a modificar" });

      const { proyecto_id, descripcion, monto_ejecutado, fecha_inicio, fecha_fin } = req.body;

      let proyectoId = old.proyecto_id;
      if (proyecto_id) {
        const proy = await prisma.proyectos.findFirst({
          where: { AND: [{ proyecto_id: parseInt(proyecto_id) }, { fecha_eliminacion: null }] },
        });
        if (!proy)
          return res.status(400).json({ ok: false, msg: "El proyecto especificado no existe" });
        proyectoId = parseInt(proyecto_id);
      }

      const avaluo = await prisma.avaluos.update({
        where: { avaluo_id: idNum },
        data: {
          proyecto_id: proyectoId,
          descripcion: descripcion?.trim() ?? old.descripcion,
          monto_ejecutado:
            monto_ejecutado != null ? parseFloat(monto_ejecutado) : old.monto_ejecutado,
          fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : old.fecha_inicio,
          fecha_fin: fecha_fin ? new Date(fecha_fin) : old.fecha_fin,
          fecha_actualizacion: new Date(),
        },
      });

      res.json({ ok: true, msg: "Avalúo actualizado correctamente", data: avaluo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID del avalúo debe ser un número" });

    try {
      const existe = await prisma.avaluos.findFirst({
        where: { AND: [{ avaluo_id: idNum }, { fecha_eliminacion: null }] },
      });
      if (!existe)
        return res.status(404).json({ ok: false, msg: "No se encontró el avalúo a eliminar" });

      const { avaluo_id } = await prisma.avaluos.update({
        where: { avaluo_id: idNum },
        data: { fecha_eliminacion: new Date() },
      });

      res.json({ ok: true, msg: "Avalúo eliminado correctamente", id: avaluo_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }
}
