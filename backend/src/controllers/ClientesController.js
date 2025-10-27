// ✅ ClientesController.js
import prisma from "../database.js";

export default class ClientesController {
  static async getAll(_req, res) {
    try {
      const clientes = await prisma.clientes.findMany({
        where: { fecha_eliminacion: null },
        orderBy: { cliente_id: "asc" },
      });
      res.json({ ok: true, data: clientes });
    } catch (error) {
      console.error("❌ Error en getAll:", error);
      res.status(500).json({ ok: false, msg: "Error al obtener los clientes." });
    }
  }

  static async getById(req, res) {
    const id = req.params.id?.trim();
    if (!id) return res.status(400).json({ ok: false, msg: "El ID del cliente es requerido." });

    try {
      const cliente = await prisma.clientes.findFirst({
        where: { cliente_id: id, fecha_eliminacion: null },
      });
      if (!cliente)
        return res.status(404).json({ ok: false, msg: `No se encontró el cliente con ID: ${id}` });

      res.json({ ok: true, data: cliente });
    } catch (error) {
      console.error("❌ Error en getById:", error);
      res.status(500).json({ ok: false, msg: "Error al obtener el cliente." });
    }
  }

  static async create(req, res) {
    try {
      const {
        cliente_id,
        nombre_empresa,
        nombre_contacto,
        cargo_contacto,
        direccion,
        ciudad,
        pais,
        telefono,
      } = req.body;

      if (!cliente_id || !nombre_empresa) {
        return res.status(400).json({ ok: false, msg: "Campos obligatorios: cliente_id y nombre_empresa." });
      }

      const existe = await prisma.clientes.findUnique({ where: { cliente_id } });
      if (existe)
        return res.status(409).json({ ok: false, msg: "Ya existe un cliente con ese ID." });

      const cliente = await prisma.clientes.create({
        data: {
          cliente_id: cliente_id.trim(),
          nombre_empresa: nombre_empresa.trim(),
          nombre_contacto: nombre_contacto?.trim() ?? null,
          cargo_contacto: cargo_contacto?.trim() ?? null,
          direccion: direccion?.trim() ?? null,
          ciudad: ciudad?.trim() ?? null,
          pais: pais?.trim() ?? null,
          telefono: telefono?.trim() ?? null,
        },
      });

      res.status(201).json({ ok: true, msg: "Cliente creado correctamente.", data: cliente });
    } catch (error) {
      console.error("❌ Error en create:", error);
      res.status(500).json({ ok: false, msg: "Error interno al crear el cliente." });
    }
  }

  static async update(req, res) {
    const id = req.params.id?.trim();
    if (!id) return res.status(400).json({ ok: false, msg: "El ID del cliente es requerido." });

    try {
      const old = await prisma.clientes.findUnique({ where: { cliente_id: id } });
      if (!old || old.fecha_eliminacion !== null)
        return res.status(404).json({ ok: false, msg: "No se encontró el cliente a modificar." });

      const {
        nombre_empresa,
        nombre_contacto,
        cargo_contacto,
        direccion,
        ciudad,
        pais,
        telefono,
      } = req.body;

      const cliente = await prisma.clientes.update({
        where: { cliente_id: id },
        data: {
          nombre_empresa: nombre_empresa?.trim() ?? old.nombre_empresa,
          nombre_contacto: nombre_contacto?.trim() ?? old.nombre_contacto,
          cargo_contacto: cargo_contacto?.trim() ?? old.cargo_contacto,
          direccion: direccion?.trim() ?? old.direccion,
          ciudad: ciudad?.trim() ?? old.ciudad,
          pais: pais?.trim() ?? old.pais,
          telefono: telefono?.trim() ?? old.telefono,
          fecha_actualizacion: new Date(),
        },
      });

      res.json({ ok: true, msg: "Cliente actualizado correctamente.", data: cliente });
    } catch (error) {
      console.error("❌ Error en update:", error);
      res.status(500).json({ ok: false, msg: "Error interno al actualizar el cliente." });
    }
  }

  static async delete(req, res) {
    const id = req.params.id?.trim();
    if (!id) return res.status(400).json({ ok: false, msg: "El ID del cliente es requerido." });

    try {
      const existe = await prisma.clientes.findFirst({
        where: { cliente_id: id, fecha_eliminacion: null },
      });
      if (!existe)
        return res.status(404).json({ ok: false, msg: "No se encontró el cliente a eliminar." });

      await prisma.clientes.update({
        where: { cliente_id: id },
        data: { fecha_eliminacion: new Date() },
      });

      res.json({ ok: true, msg: "Cliente eliminado correctamente." });
    } catch (error) {
      console.error("❌ Error en delete:", error);
      res.status(500).json({ ok: false, msg: "Error interno al eliminar el cliente." });
    }
  }
}
