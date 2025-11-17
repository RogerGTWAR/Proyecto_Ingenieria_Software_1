import prisma from "../database.js";

export default class MaterialesController {
  // ============================================================
  // GET ALL
  // ============================================================
  static async getAll(_req, res) {
    try {
      const materiales = await prisma.materiales.findMany({
        where: {
          fecha_eliminacion: null
        },
        include: {
          categorias: {
            select: {
              categoria_id: true,
              nombre_categoria: true
            }
          }
        },
        orderBy: { material_id: "asc" }
      });

      res.json({ ok: true, data: materiales });
    } catch (error) {
      console.error("❌ Error getAll materiales:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno al obtener los materiales"
      });
    }
  }

  // ============================================================
  // GET BY ID
  // ============================================================
  static async getById(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ ok: false, msg: "El ID debe ser numérico" });

    try {
      const material = await prisma.materiales.findFirst({
        where: {
          material_id: id,
          fecha_eliminacion: null
        },
        include: {
          categorias: {
            select: {
              categoria_id: true,
              nombre_categoria: true
            }
          }
        }
      });

      if (!material)
        return res.status(404).json({
          ok: false,
          msg: `No se encontró el material con ID ${id}`
        });

      res.json({ ok: true, data: material });
    } catch (error) {
      console.error("❌ Error getById materiales:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno al obtener el material"
      });
    }
  }

  // ============================================================
  // CREATE
  // ============================================================
  static async create(req, res) {
    try {
      const {
        nombre_material,
        categoria_id,
        descripcion,
        unidad_de_medida,
        cantidad_en_stock,
        precio_unitario
      } = req.body;

      // Validación de campos obligatorios
      if (
        !nombre_material ||
        !unidad_de_medida ||
        cantidad_en_stock == null ||
        precio_unitario == null
      ) {
        return res.status(400).json({
          ok: false,
          msg: "Faltan campos obligatorios"
        });
      }

      // Validar que no exista otro con el mismo nombre
      const existe = await prisma.materiales.findFirst({
        where: {
          nombre_material: nombre_material.trim(),
          fecha_eliminacion: null
        }
      });

      if (existe)
        return res.status(409).json({
          ok: false,
          msg: "Ya existe un material con ese nombre"
        });

      const material = await prisma.materiales.create({
        data: {
          nombre_material: nombre_material.trim(),
          categoria_id: categoria_id ? Number(categoria_id) : null,
          descripcion: descripcion?.trim() ?? null,
          unidad_de_medida: unidad_de_medida.trim(),
          cantidad_en_stock: Number(cantidad_en_stock),
          precio_unitario: Number(precio_unitario)
        }
      });

      res.status(201).json({
        ok: true,
        msg: "Material creado correctamente",
        data: material
      });
    } catch (error) {
      console.error("❌ Error create materiales:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno al crear material"
      });
    }
  }

  // ============================================================
  // UPDATE
  // ============================================================
  static async update(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ ok: false, msg: "El ID debe ser numérico" });

    try {
      const old = await prisma.materiales.findFirst({
        where: { material_id: id, fecha_eliminacion: null }
      });

      if (!old)
        return res.status(404).json({
          ok: false,
          msg: "Material no encontrado o ya eliminado"
        });

      const {
        nombre_material,
        categoria_id,
        descripcion,
        unidad_de_medida,
        cantidad_en_stock,
        precio_unitario
      } = req.body;

      const material = await prisma.materiales.update({
        where: { material_id: id },
        data: {
          nombre_material: nombre_material ?? old.nombre_material,
          categoria_id: categoria_id ? Number(categoria_id) : old.categoria_id,
          descripcion: descripcion ?? old.descripcion,
          unidad_de_medida: unidad_de_medida ?? old.unidad_de_medida,
          cantidad_en_stock:
            cantidad_en_stock != null
              ? Number(cantidad_en_stock)
              : old.cantidad_en_stock,
          precio_unitario:
            precio_unitario != null
              ? Number(precio_unitario)
              : old.precio_unitario,
          fecha_actualizacion: new Date()
        }
      });

      res.json({
        ok: true,
        msg: "Material actualizado",
        data: material
      });
    } catch (error) {
      console.error("❌ Error update materiales:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno al actualizar material"
      });
    }
  }

  // ============================================================
  // DELETE (Soft delete)
  // ============================================================
  static async delete(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ ok: false, msg: "El ID debe ser numérico" });

    try {
      const material = await prisma.materiales.findFirst({
        where: {
          material_id: id,
          fecha_eliminacion: null
        }
      });

      if (!material)
        return res.status(404).json({
          ok: false,
          msg: "Material no encontrado o ya eliminado"
        });

      await prisma.materiales.update({
        where: { material_id: id },
        data: {
          fecha_eliminacion: new Date()
        }
      });

      res.json({
        ok: true,
        msg: "Material eliminado correctamente"
      });
    } catch (error) {
      console.error("❌ Error delete materiales:", error);
      res.status(500).json({
        ok: false,
        msg: "Error interno al eliminar material"
      });
    }
  }
}
