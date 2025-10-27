//Listo
import prisma from "../database.js";

export default class ProductosController {
  static async getAll(_req, res) {
    try {
      const productos = await prisma.productos.findMany({
        where: { fecha_eliminacion: null },
        include: {
          categorias: { select: { categoria_id: true, nombre_categoria: true } },
        },
        orderBy: { producto_id: "asc" },
      });
      res.json({ ok: true, data: productos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async getById(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID del producto debe ser un número" });

    try {
      const producto = await prisma.productos.findFirst({
        where: { AND: [{ producto_id: idNum }, { fecha_eliminacion: null }] },
        include: {
          categorias: { select: { categoria_id: true, nombre_categoria: true } },
        },
      });

      if (!producto)
        return res
          .status(404)
          .json({ ok: false, msg: `No se encontró el producto con ID: ${idNum}` });

      res.json({ ok: true, data: producto });
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
        nombre_producto,
        categoria_id,
        descripcion,
        unidad_de_medida,
        cantidad_en_stock,
        precio_unitario,
      } = req.body;

      if (!nombre_producto || !unidad_de_medida || cantidad_en_stock == null || precio_unitario == null) {
        return res.status(400).json({
          ok: false,
          msg: "Campos obligatorios: nombre_producto, unidad_de_medida, cantidad_en_stock y precio_unitario",
        });
      }

      const existe = await prisma.productos.findFirst({
        where: { AND: [{ nombre_producto: nombre_producto.trim() }, { fecha_eliminacion: null }] },
      });
      if (existe)
        return res.status(409).json({ ok: false, msg: "Ya existe un producto con ese nombre" });

      let categoriaId = null;
      if (categoria_id) {
        const catOk = await prisma.categorias.findFirst({
          where: { AND: [{ categoria_id: parseInt(categoria_id) }, { fecha_eliminacion: null }] },
        });
        if (!catOk)
          return res
            .status(400)
            .json({ ok: false, msg: "La categoría especificada no existe o fue eliminada" });
        categoriaId = parseInt(categoria_id);
      }

      const producto = await prisma.productos.create({
        data: {
          nombre_producto: nombre_producto.trim(),
          categoria_id: categoriaId,
          descripcion: descripcion?.trim() ?? null,
          unidad_de_medida: unidad_de_medida.trim(),
          cantidad_en_stock: parseInt(cantidad_en_stock),
          precio_unitario: parseFloat(precio_unitario),
        },
      });

      res.status(201).json({ ok: true, msg: "Producto creado correctamente", data: producto });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID del producto debe ser un número" });

    const old = await prisma.productos.findUnique({ where: { producto_id: idNum } });
    if (!old || old.fecha_eliminacion !== null)
      return res.status(404).json({ ok: false, msg: "No se encontró el producto a modificar" });

    try {
      const {
        nombre_producto,
        categoria_id,
        descripcion,
        unidad_de_medida,
        cantidad_en_stock,
        precio_unitario,
      } = req.body;

      const producto = await prisma.productos.update({
        where: { producto_id: idNum },
        data: {
          nombre_producto: nombre_producto?.trim() ?? old.nombre_producto,
          categoria_id: categoria_id ? parseInt(categoria_id) : old.categoria_id,
          descripcion: descripcion?.trim() ?? old.descripcion,
          unidad_de_medida: unidad_de_medida?.trim() ?? old.unidad_de_medida,
          cantidad_en_stock:
            cantidad_en_stock != null ? parseInt(cantidad_en_stock) : old.cantidad_en_stock,
          precio_unitario:
            precio_unitario != null ? parseFloat(precio_unitario) : old.precio_unitario,
          fecha_actualizacion: new Date(),
        },
      });

      res.json({ ok: true, msg: "Producto actualizado correctamente", data: producto });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res.status(400).json({ ok: false, msg: "El ID del producto debe ser un número" });

    try {
      const existe = await prisma.productos.findFirst({
        where: { AND: [{ producto_id: idNum }, { fecha_eliminacion: null }] },
      });
      if (!existe)
        return res.status(404).json({ ok: false, msg: "No se encontró el producto a eliminar" });

      const { producto_id } = await prisma.productos.update({
        where: { producto_id: idNum },
        data: { fecha_eliminacion: new Date() },
      });

      res.json({ ok: true, msg: "Producto eliminado correctamente", id: producto_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }
}
