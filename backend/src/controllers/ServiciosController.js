//Listo
import prisma from "../database.js";

export default class ServiciosController {

  
  static async getAll(_req, res) {
    try {
      const servicios = await prisma.servicios.findMany({
        where: { fecha_eliminacion: null },
        orderBy: { servicio_id: "asc" }
      });

      const list = servicios.map(s => ({
        ...s,
        costo_venta:
          Number(s.total_costo_directo) + Number(s.total_costo_indirecto)
      }));

      res.json({ ok: true, data: list });

    } catch (error) {
      console.error("Error en getAll:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno al obtener servicios."
      });
    }
  }

  static async getById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ ok: false, msg: "ID inválido." });

      const s = await prisma.servicios.findFirst({
        where: {
          servicio_id: id,
          fecha_eliminacion: null,
        }
      });

      if (!s)
        return res.status(404).json({ ok: false, msg: "Servicio no encontrado." });

      const servicio = {
        ...s,
        costo_venta:
          Number(s.total_costo_directo) + Number(s.total_costo_indirecto)
      };

      res.json({ ok: true, data: servicio });

    } catch (error) {
      console.error("Error en getById:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno al obtener el servicio."
      });
    }
  }


  static async create(req, res) {
    try {
      const {
        nombre_servicio,
        descripcion,
        total_costo_directo,
        total_costo_indirecto
      } = req.body;

      if (!nombre_servicio || total_costo_directo == null || total_costo_indirecto == null) {
        return res.status(400).json({
          ok: false,
          msg: "Campos obligatorios: nombre_servicio, total_costo_directo, total_costo_indirecto."
        });
      }

      const nuevo = await prisma.servicios.create({
        data: {
          nombre_servicio: nombre_servicio.trim(),
          descripcion: descripcion?.trim() || null,
          total_costo_directo: Number(total_costo_directo),
          total_costo_indirecto: Number(total_costo_indirecto),
        }
      });

      const data = {
        ...nuevo,
        costo_venta:
          Number(nuevo.total_costo_directo) + Number(nuevo.total_costo_indirecto)
      };

      res.status(201).json({
        ok: true,
        msg: "Servicio creado correctamente.",
        data
      });

    } catch (error) {
      console.error("Error en create:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno al crear el servicio."
      });
    }
  }

  static async update(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ ok: false, msg: "ID inválido." });

      const old = await prisma.servicios.findFirst({
        where: {
          servicio_id: id,
          fecha_eliminacion: null
        }
      });

      if (!old)
        return res.status(404).json({ ok: false, msg: "Servicio no encontrado." });

      const {
        nombre_servicio,
        descripcion,
        total_costo_directo,
        total_costo_indirecto
      } = req.body;

      const actualizado = await prisma.servicios.update({
        where: { servicio_id: id },
        data: {
          nombre_servicio: nombre_servicio?.trim() ?? old.nombre_servicio,
          descripcion: descripcion?.trim() ?? old.descripcion,
          total_costo_directo:
            total_costo_directo != null
              ? Number(total_costo_directo)
              : old.total_costo_directo,
          total_costo_indirecto:
            total_costo_indirecto != null
              ? Number(total_costo_indirecto)
              : old.total_costo_indirecto,
          fecha_actualizacion: new Date()
        }
      });

      const data = {
        ...actualizado,
        costo_venta:
          Number(actualizado.total_costo_directo) +
          Number(actualizado.total_costo_indirecto)
      };

      res.json({ ok: true, msg: "Servicio actualizado.", data });

    } catch (error) {
      console.error("Error en update:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno al actualizar el servicio."
      });
    }
  }

  static async delete(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ ok: false, msg: "ID inválido." });

      const existe = await prisma.servicios.findFirst({
        where: {
          servicio_id: id,
          fecha_eliminacion: null
        }
      });

      if (!existe)
        return res.status(404).json({
          ok: false,
          msg: "No se encontró el servicio a eliminar."
        });

      await prisma.servicios.update({
        where: { servicio_id: id },
        data: { fecha_eliminacion: new Date() }
      });

      res.json({
        ok: true,
        msg: "Servicio eliminado correctamente."
      });

    } catch (error) {
      console.error("Error en delete:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno al eliminar el servicio."
      });
    }
  }
}
