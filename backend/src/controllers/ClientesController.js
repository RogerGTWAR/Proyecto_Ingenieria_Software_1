//Listo
import prisma from "../database.js";

export default class ClientesController {
  static async getAll(_req, res) {
    try {
      const clientes = await prisma.clientes.findMany({
        where: { fecha_eliminacion: null },
        orderBy: { cliente_id: "asc" }
      });

      res.json({ ok: true, data: clientes });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async getById(req, res) {
    const id = req.params.id.trim();

    if (!id) {
      return res.status(400).json({ ok: false, msg: "El id de cliente es requerido" });
    }

    try {
      const cliente = await prisma.clientes.findFirst({
        where: { AND: [{ cliente_id: id }, { fecha_eliminacion: null }] }
      });

      if (!cliente) {
        return res.status(404).json({ ok: false, msg: `No se encontró el cliente con id: ${id}` });
      }

      res.json({ ok: true, data: cliente });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server Error, something went wrong" });
    }
  }

  static async create(req, res) {
    const {
      cliente_id,
      nombre_empresa,
      nombre_contacto,
      cargo_contacto,
      direccion,
      ciudad,
      pais,
      telefono
    } = req.body;

    if (!cliente_id || !nombre_empresa) {
      return res.status(400).json({ ok: false, msg: "Faltan campos obligatorios (cliente_id, nombre_empresa)" });
    }

    try {
      const existe = await prisma.clientes.findUnique({ where: { cliente_id } });
      if (existe) {
        return res.status(400).json({ ok: false, msg: "Ya existe un cliente con ese ID" });
      }

      const cliente = await prisma.clientes.create({
        data: {
          cliente_id,
          nombre_empresa,
          nombre_contacto: nombre_contacto ?? null,
          cargo_contacto: cargo_contacto ?? null,
          direccion: direccion ?? null,
          ciudad: ciudad ?? null,
          pais: pais ?? null,
          telefono: telefono ?? null
        }
      });

      res.status(201).json({ ok: true, msg: "Cliente creado correctamente", data: cliente });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async update(req, res) {
    const id = req.params.id.trim();

    const old = await prisma.clientes.findUnique({ where: { cliente_id: id } });
    if (!old || old.fecha_eliminacion !== null) {
      return res.status(404).json({ ok: false, msg: "No se encontró el cliente que se desea modificar" });
    }

    const {
      nombre_empresa,
      nombre_contacto,
      cargo_contacto,
      direccion,
      ciudad,
      pais,
      telefono
    } = req.body;

    try {
      const cliente = await prisma.clientes.update({
        where: { cliente_id: id },
        data: {
          nombre_empresa: nombre_empresa ?? old.nombre_empresa,
          nombre_contacto: nombre_contacto ?? old.nombre_contacto,
          cargo_contacto: cargo_contacto ?? old.cargo_contacto,
          direccion: direccion ?? old.direccion,
          ciudad: ciudad ?? old.ciudad,
          pais: pais ?? old.pais,
          telefono: telefono ?? old.telefono,
          fecha_actualizacion: new Date()
        }
      });

      res.json({ ok: true, msg: "Cliente actualizado correctamente", data: cliente });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async delete(req, res) {
    const id = req.params.id.trim();

    const existe = await prisma.clientes.findFirst({
      where: { AND: [{ cliente_id: id }, { fecha_eliminacion: null }] }
    });

    if (!existe) {
      return res.status(404).json({ ok: false, msg: "No se encontró el cliente que se desea eliminar" });
    }

    try {
      const cliente = await prisma.clientes.update({
        where: { cliente_id: id },
        data: { fecha_eliminacion: new Date() }
      });

      res.json({ ok: true, msg: "Cliente eliminado correctamente", id: cliente.cliente_id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }
}
