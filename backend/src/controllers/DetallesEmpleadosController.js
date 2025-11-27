import prisma from "../database.js";

export default class DetallesEmpleadosController {
  static async getAll(_req, res) {
    try {
      const detalles = await prisma.detalles_empleados.findMany({
        where: { fecha_eliminacion: null },
        include: {
          empleados: {
            select: {
              empleado_id: true,
              nombres: true,
              apellidos: true,
              roles: { select: { cargo: true } }, 
            },
          },

          proyectos: {
            select: { proyecto_id: true, nombre_proyecto: true },
          },
        },
        orderBy: { detalle_empleado_id: "asc" },
      });

      res.json({ ok: true, data: detalles });
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
      return res
        .status(400)
        .json({ ok: false, msg: "El ID del detalle debe ser un número" });

    try {
      const detalle = await prisma.detalles_empleados.findFirst({
        where: {
          AND: [{ detalle_empleado_id: idNum }, { fecha_eliminacion: null }],
        },
        include: {
          empleados: {
            select: { empleado_id: true, nombres: true, apellidos: true },
          },
          proyectos: {
            select: { proyecto_id: true, nombre_proyecto: true },
          },
        },
      });

      if (!detalle)
        return res
          .status(404)
          .json({ ok: false, msg: `No se encontró el detalle con ID: ${idNum}` });

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
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "El cuerpo de la petición está vacío o mal formateado. Usa JSON válido.",
      });
    }

    const { empleado_id, proyecto_id, fecha_de_proyecto } = req.body;

    const empleadoId = parseInt(empleado_id);
    const proyectoId = parseInt(proyecto_id);

    if (isNaN(empleadoId) || isNaN(proyectoId)) {
      return res.status(400).json({
        ok: false,
        msg: "Los IDs de empleado y proyecto deben ser números válidos",
      });
    }

    const empOk = await prisma.empleados.findFirst({
      where: { AND: [{ empleado_id: empleadoId }, { fecha_eliminacion: null }] },
    });
    if (!empOk)
      return res.status(400).json({
        ok: false,
        msg: "El empleado especificado no existe o fue dado de baja",
      });

    const proyOk = await prisma.proyectos.findFirst({
      where: { AND: [{ proyecto_id: proyectoId }, { fecha_eliminacion: null }] },
    });
    if (!proyOk)
      return res.status(400).json({
        ok: false,
        msg: "El proyecto especificado no existe o fue dado de baja",
      });

    const previo = await prisma.detalles_empleados.findFirst({
      where: {
        empleado_id: empleadoId,
        proyecto_id: proyectoId,
      },
      include: {
        empleados: { select: { empleado_id: true, nombres: true, apellidos: true } },
        proyectos: { select: { proyecto_id: true, nombre_proyecto: true } },
      },
    });

    if (previo && previo.fecha_eliminacion !== null) {
      const reactivado = await prisma.detalles_empleados.update({
        where: { detalle_empleado_id: previo.detalle_empleado_id },
        data: {
          fecha_eliminacion: null,
          fecha_de_proyecto: fecha_de_proyecto ? new Date(fecha_de_proyecto) : previo.fecha_de_proyecto,
          fecha_actualizacion: new Date(),
        },
        include: {
          empleados: { select: { empleado_id: true, nombres: true, apellidos: true } },
          proyectos: { select: { proyecto_id: true, nombre_proyecto: true } },
        },
      });

      return res.status(200).json({
        ok: true,
        msg: "Detalle reactivado correctamente",
        data: reactivado,
      });
    }

    if (previo && previo.fecha_eliminacion === null) {
      return res.status(200).json({
        ok: true,
        msg: "El detalle ya existía y está activo",
        data: previo,
      });
    }

    const detalle = await prisma.detalles_empleados.create({
      data: {
        empleado_id: empleadoId,
        proyecto_id: proyectoId,
        fecha_de_proyecto: fecha_de_proyecto ? new Date(fecha_de_proyecto) : null,
      },
      include: {
        empleados: { select: { empleado_id: true, nombres: true, apellidos: true } },
        proyectos: { select: { proyecto_id: true, nombre_proyecto: true } },
      },
    });

    return res.status(201).json({
      ok: true,
      msg: "Detalle creado correctamente",
      data: detalle,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Server error, something went wrong",
    });
  }
}


  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res
        .status(400)
        .json({ ok: false, msg: "El ID del detalle debe ser un número" });

    try {
      const old = await prisma.detalles_empleados.findUnique({
        where: { detalle_empleado_id: idNum },
      });

      if (!old || old.fecha_eliminacion !== null)
        return res.status(404).json({
          ok: false,
          msg: "No se encontró el detalle que se desea modificar",
        });

      const { empleado_id, proyecto_id, fecha_de_proyecto } = req.body;

      let empleadoId = old.empleado_id;
      if (empleado_id !== undefined) {
        const parsed = parseInt(empleado_id);
        if (isNaN(parsed))
          return res
            .status(400)
            .json({ ok: false, msg: "El ID de empleado debe ser numérico" });

        const empOk = await prisma.empleados.findFirst({
          where: { AND: [{ empleado_id: parsed }, { fecha_eliminacion: null }] },
        });
        if (!empOk)
          return res.status(400).json({
            ok: false,
            msg: "El empleado especificado no existe o fue dado de baja",
          });

        empleadoId = parsed;
      }

      let proyectoId = old.proyecto_id;
      if (proyecto_id !== undefined) {
        const parsed = parseInt(proyecto_id);
        if (isNaN(parsed))
          return res
            .status(400)
            .json({ ok: false, msg: "El ID de proyecto debe ser numérico" });

        const proyOk = await prisma.proyectos.findFirst({
          where: { AND: [{ proyecto_id: parsed }, { fecha_eliminacion: null }] },
        });
        if (!proyOk)
          return res.status(400).json({
            ok: false,
            msg: "El proyecto especificado no existe o fue dado de baja",
          });

        proyectoId = parsed;
      }

      const detalle = await prisma.detalles_empleados.update({
        where: { detalle_empleado_id: idNum },
        data: {
          empleado_id: empleadoId,
          proyecto_id: proyectoId,
          fecha_de_proyecto: fecha_de_proyecto
            ? new Date(fecha_de_proyecto)
            : old.fecha_de_proyecto,
          fecha_actualizacion: new Date(),
        },
        include: {
          empleados: { select: { empleado_id: true, nombres: true, apellidos: true } },
          proyectos: { select: { proyecto_id: true, nombre_proyecto: true } },
        },
      });

      res.json({
        ok: true,
        msg: "Detalle actualizado correctamente",
        data: detalle,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: "Server error, something went wrong",
      });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res
        .status(400)
        .json({ ok: false, msg: "El ID del detalle debe ser un número" });

    try {
      const existe = await prisma.detalles_empleados.findFirst({
        where: {
          AND: [{ detalle_empleado_id: idNum }, { fecha_eliminacion: null }],
        },
      });

      if (!existe)
        return res
          .status(404)
          .json({ ok: false, msg: "No se encontró el detalle a eliminar" });

      const { detalle_empleado_id } = await prisma.detalles_empleados.update({
        where: { detalle_empleado_id: idNum },
        data: { fecha_eliminacion: new Date() },
      });

      res.json({
        ok: true,
        msg: "Detalle eliminado correctamente",
        id: detalle_empleado_id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: "Server error, something went wrong",
      });
    }
  }
}
