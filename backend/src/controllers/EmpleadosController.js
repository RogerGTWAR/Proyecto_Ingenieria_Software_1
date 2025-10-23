//Listo
import prisma from "../database.js";

export default class EmpleadosController {
  static async getAll(_req, res) {
    try {
      const empleados = await prisma.empleados.findMany({
        where: { fecha_eliminacion: null },
        include: { roles: true },
        orderBy: { empleado_id: "asc" },
      });
      res.json({ ok: true, data: empleados });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async getById(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID del empleado debe ser un número" });

    try {
      const empleado = await prisma.empleados.findFirst({
        where: { AND: [{ empleado_id: idNum }, { fecha_eliminacion: null }] },
        include: { roles: true },
      });

      if (!empleado)
        return res
          .status(404)
          .json({ ok: false, msg: `No se encontró el empleado con ID: ${idNum}` });

      res.json({ ok: true, data: empleado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
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

      const {
        nombres,
        apellidos,
        cedula,
        rol_id,
        fecha_nacimiento,
        fecha_contratacion,
        direccion,
        pais,
        telefono,
        correo,
        reportes,
      } = req.body;

      if (!nombres || !apellidos || !cedula || !rol_id || !fecha_nacimiento || !fecha_contratacion) {
        return res.status(400).json({
          ok: false,
          msg: "Campos obligatorios: nombres, apellidos, cedula, rol_id, fecha_nacimiento, fecha_contratacion",
        });
      }

      const rolExistente = await prisma.roles.findUnique({
        where: { rol_id: parseInt(rol_id) },
      });
      if (!rolExistente) {
        return res.status(400).json({ ok: false, msg: "El rol especificado no existe" });
      }

      const existeCedula = await prisma.empleados.findFirst({
        where: { cedula: cedula.trim(), fecha_eliminacion: null },
      });
      if (existeCedula) {
        return res.status(409).json({ ok: false, msg: "Ya existe un empleado con esa cédula" });
      }

      const empleado = await prisma.empleados.create({
        data: {
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          cedula: cedula.trim(),
          rol_id: parseInt(rol_id),
          fecha_nacimiento: new Date(fecha_nacimiento),
          fecha_contratacion: new Date(fecha_contratacion),
          direccion: direccion?.trim() || null,
          pais: pais?.trim() || null,
          telefono: telefono?.trim() || null,
          correo: correo?.trim() || null,
          reportes: reportes ? parseInt(reportes) : null,
        },
      });

      res.status(201).json({ ok: true, msg: "Empleado creado correctamente", data: empleado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID del empleado debe ser un número" });

    const old = await prisma.empleados.findUnique({ where: { empleado_id: idNum } });
    if (!old || old.fecha_eliminacion !== null) {
      return res.status(404).json({ ok: false, msg: "No se encontró el empleado a modificar" });
    }

    try {
      const {
        nombres,
        apellidos,
        cedula,
        rol_id,
        fecha_nacimiento,
        fecha_contratacion,
        direccion,
        pais,
        telefono,
        correo,
        reportes,
      } = req.body;

      const empleado = await prisma.empleados.update({
        where: { empleado_id: idNum },
        data: {
          nombres: nombres?.trim() ?? old.nombres,
          apellidos: apellidos?.trim() ?? old.apellidos,
          cedula: cedula?.trim() ?? old.cedula,
          rol_id: rol_id ? parseInt(rol_id) : old.rol_id,
          fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : old.fecha_nacimiento,
          fecha_contratacion: fecha_contratacion
            ? new Date(fecha_contratacion)
            : old.fecha_contratacion,
          direccion: direccion?.trim() ?? old.direccion,
          pais: pais?.trim() ?? old.pais,
          telefono: telefono?.trim() ?? old.telefono,
          correo: correo?.trim() ?? old.correo,
          reportes: reportes ? parseInt(reportes) : old.reportes,
          fecha_actualizacion: new Date(),
        },
      });

      res.json({ ok: true, msg: "Empleado actualizado correctamente", data: empleado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID del empleado debe ser un número" });

    const existe = await prisma.empleados.findFirst({
      where: { AND: [{ empleado_id: idNum }, { fecha_eliminacion: null }] },
    });
    if (!existe)
      return res.status(404).json({ ok: false, msg: "No se encontró el empleado a eliminar" });

    try {
      const { empleado_id } = await prisma.empleados.update({
        where: { empleado_id: idNum },
        data: { fecha_eliminacion: new Date() },
      });

      res.json({ ok: true, msg: "Empleado eliminado correctamente", id: empleado_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }
}
