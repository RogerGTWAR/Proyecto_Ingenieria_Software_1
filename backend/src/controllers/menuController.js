import prisma from "../database.js";

export default class menuController {

  static async getAll(_req, res) {
    try {
      const data = await prisma.menu.findMany({
        where: { estado: true },
        include: {
          parent: true,
          children: true
        },
        orderBy: { id_menu: "asc" }
      });

      res.json({ ok: true, data });

    } catch (error) {
      console.error("Error Menu getAll:", error);
      res.status(500).json({ ok: false, msg: "Error al obtener menús." });
    }
  }

  static async getById(req, res) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id))
        return res.status(400).json({ ok: false, msg: "ID inválido." });

      const item = await prisma.menu.findUnique({
        where: { id_menu: id },
        include: {
          parent: true,
          children: true
        }
      });

      if (!item)
        return res.status(404).json({ ok: false, msg: "Menú no encontrado." });

      res.json({ ok: true, data: item });

    } catch (error) {
      console.error("Error Menu getById:", error);
      res.status(500).json({ ok: false, msg: "Error interno del sistema." });
    }
  }

  static async create(req, res) {
    try {
      const { nombre, es_submenu, url, id_menu_parent, estado, show } = req.body;

      if (!nombre)
        return res.status(400).json({ ok: false, msg: "El nombre es obligatorio." });

      if (es_submenu && !id_menu_parent)
        return res.status(400).json({
          ok: false,
          msg: "Un submenú debe tener un menú padre."
        });

      const nuevo = await prisma.menu.create({
        data: {
          nombre,
          es_submenu: Boolean(es_submenu),
          url: url || null,
          id_menu_parent: id_menu_parent ? Number(id_menu_parent) : null,
          estado: estado ?? true,
          show: show ?? true
        }
      });

      res.status(201).json({ ok: true, msg: "Menú creado.", data: nuevo });

    } catch (error) {
      console.error("Error Menu create:", error);
      res.status(500).json({ ok: false, msg: "Error al crear menú." });
    }
  }

  static async update(req, res) {
    try {
      const id = Number(req.params.id);

      const old = await prisma.menu.findUnique({
        where: { id_menu: id }
      });

      if (!old)
        return res.status(404).json({ ok: false, msg: "Menú no encontrado." });

      const { nombre, es_submenu, url, id_menu_parent, estado, show } = req.body;

      const upd = await prisma.menu.update({
        where: { id_menu: id },
        data: {
          nombre: nombre ?? old.nombre,
          es_submenu: es_submenu ?? old.es_submenu,
          url: url ?? old.url,
          id_menu_parent: id_menu_parent ?? old.id_menu_parent,
          estado: estado ?? old.estado,
          show: show ?? old.show
        }
      });

      res.json({ ok: true, msg: "Menú actualizado.", data: upd });

    } catch (error) {
      console.error("Error Menu update:", error);
      res.status(500).json({ ok: false, msg: "Error al actualizar menú." });
    }
  }

  static async delete(req, res) {
    try {
      const id = Number(req.params.id);

      const existe = await prisma.menu.findUnique({
        where: { id_menu: id },
        include: { children: true }
      });

      if (!existe)
        return res.status(404).json({ ok: false, msg: "Menú no encontrado." });

      if (existe.children.length > 0)
        return res.status(400).json({
          ok: false,
          msg: "No se puede eliminar un menú que tiene submenús."
        });

      await prisma.menu.delete({
        where: { id_menu: id }
      });

      res.json({ ok: true, msg: "Menú eliminado correctamente." });

    } catch (error) {
      console.error("Error Menu delete:", error);
      res.status(500).json({ ok: false, msg: "Error al eliminar menú." });
    }
  }

  static async getTree(_req, res) {
    try {
      const data = await prisma.menu.findMany({
        where: {
          estado: true,
          show: true
        },
        include: { children: true }
      });

      const tree = data
        .filter(m => !m.id_menu_parent)
        .map(parent => ({
          ...parent,
          children: data.filter(m => m.id_menu_parent === parent.id_menu)
        }));

      res.json({ ok: true, data: tree });

    } catch (error) {
      console.error("Error Menu getTree:", error);
      res.status(500).json({ ok: false, msg: "Error al construir árbol." });
    }
  }

  static async getMenuByUser(req, res) {
    try {
      const usuario_id = Number(req.params.usuario_id);

      const permisos = await prisma.permisos.findMany({
        where: {
          usuario_id,
          fecha_eliminacion: null   
        },
        include: { menu: true }
      });

      const menus = permisos.map((p) => p.menu);

      const tree = menus
        .filter((m) => !m.id_menu_parent)
        .map((parent) => ({
          ...parent,
          children: menus.filter((m) => m.id_menu_parent === parent.id_menu),
        }));

      res.json({ ok: true, data: tree });

    } catch (error) {
      console.error("Error Menu getMenuByUser:", error);
      res.status(500).json({ ok: false, msg: "Error al obtener menú del usuario." });
    }
  }
}
