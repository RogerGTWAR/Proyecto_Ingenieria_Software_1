import prisma from "../database.js";

async function recalcularMontoTotal(compraId) {
  const detalles = await prisma.detalles_compras.findMany({
    where: { compra_id: compraId, fecha_eliminacion: null },
    select: { cantidad: true, precio_unitario: true }
  });

  const total = detalles.reduce(
    (sum, d) => sum + Number(d.cantidad) * Number(d.precio_unitario),
    0
  );

  await prisma.compras.update({
    where: { compra_id: compraId },
    data: { monto_total: total }
  });

  return total;
}

export default class DetallesComprasController {
  static async getAll(_req, res) {
    try {
      const detalles = await prisma.detalles_compras.findMany({
        where: { fecha_eliminacion: null },
        include: {
          compras: {
            select: {
              compra_id: true,
              numero_factura: true,
              fecha_compra: true,
              proveedor_id: true,
            },
          },
          materiales: {
            select: {
              material_id: true,
              nombre_material: true,
              unidad_de_medida: true,
              precio_unitario: true,  
            },
          },
        },
        orderBy: { detalle_compra_id: "asc" },
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
      const detalle = await prisma.detalles_compras.findFirst({
        where: {
          AND: [{ detalle_compra_id: idNum }, { fecha_eliminacion: null }],
        },
        include: {
          compras: {
            select: {
              compra_id: true,
              numero_factura: true,
            },
          },
          materiales: {
            select: {
              material_id: true,
              nombre_material: true,
              unidad_de_medida: true,
              precio_unitario: true,
            },
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
      const { compra_id, material_id, cantidad, precio_unitario } = req.body;

      if (!compra_id || !material_id || !cantidad || !precio_unitario)
        return res.status(400).json({
          ok: false,
          msg:
            "Campos obligatorios: compra_id, material_id, cantidad, precio_unitario",
        });

      const comp = await prisma.compras.findFirst({
        where: {
          AND: [{ compra_id: Number(compra_id) }, { fecha_eliminacion: null }],
        },
      });
      if (!comp)
        return res.status(400).json({
          ok: false,
          msg: "La compra especificada no existe o fue eliminada",
        });

      const material = await prisma.materiales.findFirst({
        where: { material_id: Number(material_id) },
      });
      if (!material)
        return res.status(400).json({
          ok: false,
          msg: "El material especificado no existe",
        });

      const detalle = await prisma.detalles_compras.create({
        data: {
          compra_id: Number(compra_id),
          material_id: Number(material_id),
          cantidad: Number(cantidad),
          precio_unitario: Number(precio_unitario),
        },
      });

      await recalcularMontoTotal(Number(compra_id));

      res.status(201).json({
        ok: true,
        msg: "Detalle registrado correctamente",
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

  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum))
      return res
        .status(400)
        .json({ ok: false, msg: "El ID del detalle debe ser numérico" });

    try {
      const old = await prisma.detalles_compras.findUnique({
        where: { detalle_compra_id: idNum },
      });

      if (!old || old.fecha_eliminacion !== null)
        return res.status(404).json({
          ok: false,
          msg: "El detalle no existe o ya fue eliminado",
        });

      const { compra_id, material_id, cantidad, precio_unitario } = req.body;

      let compraId = old.compra_id;
      if (compra_id !== undefined) {
        const comp = await prisma.compras.findFirst({
          where: {
            AND: [{ compra_id: Number(compra_id) }, { fecha_eliminacion: null }],
          },
        });
        if (!comp)
          return res.status(400).json({
            ok: false,
            msg: "La compra indicada no existe",
          });
        compraId = Number(compra_id);
      }

      let materialId = old.material_id;
      if (material_id !== undefined) {
        const mat = await prisma.materiales.findFirst({
          where: { material_id: Number(material_id) },
        });
        if (!mat)
          return res.status(400).json({
            ok: false,
            msg: "El material indicado no existe",
          });
        materialId = Number(material_id);
      }

      const updated = await prisma.detalles_compras.update({
        where: { detalle_compra_id: idNum },
        data: {
          compra_id: compraId,
          material_id: materialId,
          cantidad: cantidad ? Number(cantidad) : old.cantidad,
          precio_unitario: precio_unitario
            ? Number(precio_unitario)
            : old.precio_unitario,
          fecha_actualizacion: new Date(),
        },
      });

      await recalcularMontoTotal(compraId);

      res.json({
        ok: true,
        msg: "Detalle actualizado correctamente",
        data: updated,
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
      const existe = await prisma.detalles_compras.findFirst({
        where: {
          AND: [{ detalle_compra_id: idNum }, { fecha_eliminacion: null }],
        },
      });

      if (!existe)
        return res
          .status(404)
          .json({ ok: false, msg: "No se encontró el detalle a eliminar" });

      const del = await prisma.detalles_compras.update({
        where: { detalle_compra_id: idNum },
        data: { fecha_eliminacion: new Date() },
      });

      await recalcularMontoTotal(existe.compra_id);

      res.json({
        ok: true,
        msg: "Detalle eliminado correctamente",
        id: del.detalle_compra_id,
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
