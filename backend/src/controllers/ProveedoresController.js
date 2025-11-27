import prisma from "../database.js";

export default class ProveedoresController {
  static async getAll(_req, res) {
    try {
      const proveedores = await prisma.proveedores.findMany({
        where: { fecha_eliminacion: null },
        include: { categorias_proveedor: { select: { nombre_categoria: true } } },
        orderBy: { proveedor_id: "asc" },
      });

      const data = proveedores.map(p => ({
        ...p,
        categoria: p.categorias_proveedor?.nombre_categoria ?? null,
      }));

      res.json({ ok: true, data });
    } catch (error) {
      console.error("Error en getAll:", error);
      res.status(500).json({ ok: false, msg: "Error interno al obtener los proveedores." });
    }
  }

  static async getById(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID debe ser un número." });

    try {
      const prov = await prisma.proveedores.findFirst({
        where: { AND: [{ proveedor_id: idNum }, { fecha_eliminacion: null }] },
        include: { categorias_proveedor: { select: { nombre_categoria: true } } },
      });

      if (!prov)
        return res.status(404).json({ ok: false, msg: `No se encontró el proveedor con ID ${idNum}` });

      res.json({
        ok: true,
        data: { ...prov, categoria: prov.categorias_proveedor?.nombre_categoria ?? null },
      });
    } catch (error) {
      console.error("Error en getById:", error);
      res.status(500).json({ ok: false, msg: "Error interno al obtener el proveedor." });
    }
  }

  static async create(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).json({ ok: false, msg: "El cuerpo de la petición está vacío o mal formateado." });

      const {
        categoria_proveedor_id,
        nombre_empresa,
        nombre_contacto,
        cargo_contacto,
        direccion,
        ciudad,
        pais,
        telefono,
        correo,
      } = req.body;

      if (!categoria_proveedor_id || !nombre_empresa)
        return res.status(400).json({ ok: false, msg: "Campos obligatorios: categoria_proveedor_id y nombre_empresa" });

      const catId = parseInt(categoria_proveedor_id);
      const catOk = await prisma.categorias_proveedor.findFirst({
        where: { AND: [{ categoria_proveedor_id: catId }, { fecha_eliminacion: null }] },
      });
      if (!catOk)
        return res.status(400).json({ ok: false, msg: "La categoría no existe o fue dada de baja." });

      const proveedor = await prisma.proveedores.create({
        data: {
          categoria_proveedor_id: catId,
          nombre_empresa: nombre_empresa.trim(),
          nombre_contacto: nombre_contacto?.trim() ?? null,
          cargo_contacto: cargo_contacto?.trim() ?? null,
          direccion: direccion?.trim() ?? null,
          ciudad: ciudad?.trim() ?? null,
          pais: pais?.trim() ?? null,
          telefono: telefono?.trim() ?? null,
          correo: correo?.trim() ?? null,
        },
        include: { categorias_proveedor: { select: { nombre_categoria: true } } },
      });

      res.status(201).json({
        ok: true,
        msg: "Proveedor creado correctamente",
        data: { ...proveedor, categoria: proveedor.categorias_proveedor?.nombre_categoria ?? null },
      });
    } catch (error) {
      console.error("Error en create:", error);
      res.status(500).json({ ok: false, msg: "Error interno al crear el proveedor." });
    }
  }

  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID debe ser un número." });

    try {
      const old = await prisma.proveedores.findUnique({ where: { proveedor_id: idNum } });
      if (!old || old.fecha_eliminacion !== null)
        return res.status(404).json({ ok: false, msg: "No se encontró el proveedor a modificar." });

      const {
        categoria_proveedor_id,
        nombre_empresa,
        nombre_contacto,
        cargo_contacto,
        direccion,
        ciudad,
        pais,
        telefono,
        correo,
      } = req.body;

      let catId = old.categoria_proveedor_id;
      if (categoria_proveedor_id) {
        catId = parseInt(categoria_proveedor_id);
        const catOk = await prisma.categorias_proveedor.findFirst({
          where: { AND: [{ categoria_proveedor_id: catId }, { fecha_eliminacion: null }] },
        });
        if (!catOk)
          return res.status(400).json({ ok: false, msg: "La categoría no existe o fue dada de baja." });
      }

      const proveedor = await prisma.proveedores.update({
        where: { proveedor_id: idNum },
        data: {
          categoria_proveedor_id: catId,
          nombre_empresa: nombre_empresa?.trim() ?? old.nombre_empresa,
          nombre_contacto: nombre_contacto?.trim() ?? old.nombre_contacto,
          cargo_contacto: cargo_contacto?.trim() ?? old.cargo_contacto,
          direccion: direccion?.trim() ?? old.direccion,
          ciudad: ciudad?.trim() ?? old.ciudad,
          pais: pais?.trim() ?? old.pais,
          telefono: telefono?.trim() ?? old.telefono,
          correo: correo?.trim() ?? old.correo,
          fecha_actualizacion: new Date(),
        },
        include: { categorias_proveedor: { select: { nombre_categoria: true } } },
      });

      res.json({
        ok: true,
        msg: "Proveedor actualizado correctamente",
        data: { ...proveedor, categoria: proveedor.categorias_proveedor?.nombre_categoria ?? null },
      });
    } catch (error) {
      console.error("Error en update:", error);
      res.status(500).json({ ok: false, msg: "Error interno al actualizar el proveedor." });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID debe ser un número." });

    try {
      const existe = await prisma.proveedores.findFirst({
        where: { AND: [{ proveedor_id: idNum }, { fecha_eliminacion: null }] },
      });
      if (!existe)
        return res.status(404).json({ ok: false, msg: "No se encontró el proveedor a eliminar." });

      const { proveedor_id } = await prisma.proveedores.update({
        where: { proveedor_id: idNum },
        data: { fecha_eliminacion: new Date() },
      });

      res.json({ ok: true, msg: "Proveedor eliminado correctamente", id: proveedor_id });
    } catch (error) {
      console.error("Error en delete:", error);
      res.status(500).json({ ok: false, msg: "Error interno al eliminar el proveedor." });
    }
  }
}
