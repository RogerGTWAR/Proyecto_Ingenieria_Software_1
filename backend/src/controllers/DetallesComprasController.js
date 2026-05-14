import prisma from "../database.js";

async function recalcularMontoTotal(tx, compraId) {
  const detalles = await tx.detalles_compras.findMany({
    where: {
      compra_id: Number(compraId),
      fecha_eliminacion: null,
    },
    select: {
      cantidad: true,
      precio_unitario: true,
    },
  });

  const total = detalles.reduce(
    (sum, d) => sum + Number(d.cantidad) * Number(d.precio_unitario),
    0
  );

  await tx.compras.update({
    where: {
      compra_id: Number(compraId),
    },
    data: {
      monto_total: total,
      fecha_actualizacion: new Date(),
    },
  });

  return total;
}

async function aumentarStockMaterial(tx, materialId, cantidad) {
  await tx.materiales.update({
    where: {
      material_id: Number(materialId),
    },
    data: {
      cantidad_en_stock: {
        increment: Number(cantidad),
      },
      fecha_actualizacion: new Date(),
    },
  });
}

async function disminuirStockMaterial(tx, materialId, cantidad) {
  const material = await tx.materiales.findFirst({
    where: {
      material_id: Number(materialId),
      fecha_eliminacion: null,
    },
  });

  if (!material) {
    throw new Error("El material no existe o fue eliminado");
  }

  const stockActual = Number(material.cantidad_en_stock);
  const cantidadRestar = Number(cantidad);

  if (stockActual < cantidadRestar) {
    throw new Error(
      `No se puede disminuir el stock. Stock actual: ${stockActual}, cantidad a restar: ${cantidadRestar}`
    );
  }

  await tx.materiales.update({
    where: {
      material_id: Number(materialId),
    },
    data: {
      cantidad_en_stock: {
        decrement: cantidadRestar,
      },
      fecha_actualizacion: new Date(),
    },
  });
}

export default class DetallesComprasController {
  static async getAll(_req, res) {
    try {
      const detalles = await prisma.detalles_compras.findMany({
        where: {
          fecha_eliminacion: null,
        },
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
              cantidad_en_stock: true,
            },
          },
        },
        orderBy: {
          detalle_compra_id: "asc",
        },
      });

      res.json({
        ok: true,
        data: detalles,
      });
    } catch (error) {
      console.error("Error getAll detalles_compras:", error);

      res.status(500).json({
        ok: false,
        msg: "Server error, something went wrong",
      });
    }
  }

  static async getById(req, res) {
    const idNum = parseInt(req.params.id);

    if (isNaN(idNum)) {
      return res.status(400).json({
        ok: false,
        msg: "El ID del detalle debe ser un número",
      });
    }

    try {
      const detalle = await prisma.detalles_compras.findFirst({
        where: {
          detalle_compra_id: idNum,
          fecha_eliminacion: null,
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
              cantidad_en_stock: true,
            },
          },
        },
      });

      if (!detalle) {
        return res.status(404).json({
          ok: false,
          msg: `No se encontró el detalle con ID: ${idNum}`,
        });
      }

      res.json({
        ok: true,
        data: detalle,
      });
    } catch (error) {
      console.error("Error getById detalles_compras:", error);

      res.status(500).json({
        ok: false,
        msg: "Server error, something went wrong",
      });
    }
  }

  static async create(req, res) {
    try {
      const { compra_id, material_id, cantidad, precio_unitario } = req.body;

      if (
        !compra_id ||
        !material_id ||
        cantidad == null ||
        precio_unitario == null
      ) {
        return res.status(400).json({
          ok: false,
          msg: "Campos obligatorios: compra_id, material_id, cantidad, precio_unitario",
        });
      }

      if (Number(cantidad) <= 0) {
        return res.status(400).json({
          ok: false,
          msg: "La cantidad debe ser mayor que cero",
        });
      }

      if (Number(precio_unitario) < 0) {
        return res.status(400).json({
          ok: false,
          msg: "El precio unitario no puede ser negativo",
        });
      }

      const resultado = await prisma.$transaction(async (tx) => {
        const compra = await tx.compras.findFirst({
          where: {
            compra_id: Number(compra_id),
            fecha_eliminacion: null,
          },
        });

        if (!compra) {
          throw new Error("La compra especificada no existe o fue eliminada");
        }

        const material = await tx.materiales.findFirst({
          where: {
            material_id: Number(material_id),
            fecha_eliminacion: null,
          },
        });

        if (!material) {
          throw new Error("El material especificado no existe o fue eliminado");
        }

        const detalle = await tx.detalles_compras.create({
          data: {
            compra_id: Number(compra_id),
            material_id: Number(material_id),
            cantidad: Number(cantidad),
            precio_unitario: Number(precio_unitario),
          },
        });

        await aumentarStockMaterial(tx, material_id, cantidad);

        const total = await recalcularMontoTotal(tx, compra_id);

        return {
          detalle,
          total,
        };
      });

      res.status(201).json({
        ok: true,
        msg: "Detalle registrado correctamente. El inventario fue actualizado.",
        data: resultado.detalle,
        monto_total: resultado.total,
      });
    } catch (error) {
      console.error("Error create detalles_compras:", error);

      res.status(500).json({
        ok: false,
        msg: error.message || "Server error, something went wrong",
      });
    }
  }

  static async update(req, res) {
    const idNum = parseInt(req.params.id);

    if (isNaN(idNum)) {
      return res.status(400).json({
        ok: false,
        msg: "El ID del detalle debe ser numérico",
      });
    }

    try {
      const { compra_id, material_id, cantidad, precio_unitario } = req.body;

      if (cantidad !== undefined && Number(cantidad) <= 0) {
        return res.status(400).json({
          ok: false,
          msg: "La cantidad debe ser mayor que cero",
        });
      }

      if (precio_unitario !== undefined && Number(precio_unitario) < 0) {
        return res.status(400).json({
          ok: false,
          msg: "El precio unitario no puede ser negativo",
        });
      }

      const resultado = await prisma.$transaction(async (tx) => {
        const old = await tx.detalles_compras.findUnique({
          where: {
            detalle_compra_id: idNum,
          },
        });

        if (!old || old.fecha_eliminacion !== null) {
          throw new Error("El detalle no existe o ya fue eliminado");
        }

        const nuevoCompraId =
          compra_id !== undefined ? Number(compra_id) : Number(old.compra_id);

        const nuevoMaterialId =
          material_id !== undefined
            ? Number(material_id)
            : Number(old.material_id);

        const nuevaCantidad =
          cantidad !== undefined ? Number(cantidad) : Number(old.cantidad);

        const nuevoPrecioUnitario =
          precio_unitario !== undefined
            ? Number(precio_unitario)
            : Number(old.precio_unitario);

        const compra = await tx.compras.findFirst({
          where: {
            compra_id: nuevoCompraId,
            fecha_eliminacion: null,
          },
        });

        if (!compra) {
          throw new Error("La compra indicada no existe o fue eliminada");
        }

        const material = await tx.materiales.findFirst({
          where: {
            material_id: nuevoMaterialId,
            fecha_eliminacion: null,
          },
        });

        if (!material) {
          throw new Error("El material indicado no existe o fue eliminado");
        }

        if (Number(old.material_id) === Number(nuevoMaterialId)) {
          const diferencia = nuevaCantidad - Number(old.cantidad);

          if (diferencia > 0) {
            await aumentarStockMaterial(tx, nuevoMaterialId, diferencia);
          }

          if (diferencia < 0) {
            await disminuirStockMaterial(
              tx,
              nuevoMaterialId,
              Math.abs(diferencia)
            );
          }
        } else {
          await disminuirStockMaterial(tx, old.material_id, old.cantidad);
          await aumentarStockMaterial(tx, nuevoMaterialId, nuevaCantidad);
        }

        const updated = await tx.detalles_compras.update({
          where: {
            detalle_compra_id: idNum,
          },
          data: {
            compra_id: nuevoCompraId,
            material_id: nuevoMaterialId,
            cantidad: nuevaCantidad,
            precio_unitario: nuevoPrecioUnitario,
            fecha_actualizacion: new Date(),
          },
        });

        const comprasARecalcular = [Number(old.compra_id)];

        if (Number(old.compra_id) !== Number(nuevoCompraId)) {
          comprasARecalcular.push(Number(nuevoCompraId));
        }

        for (const idCompra of comprasARecalcular) {
          await recalcularMontoTotal(tx, idCompra);
        }

        return updated;
      });

      res.json({
        ok: true,
        msg: "Detalle actualizado correctamente. El inventario fue ajustado.",
        data: resultado,
      });
    } catch (error) {
      console.error("Error update detalles_compras:", error);

      res.status(500).json({
        ok: false,
        msg: error.message || "Server error, something went wrong",
      });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);

    if (isNaN(idNum)) {
      return res.status(400).json({
        ok: false,
        msg: "El ID del detalle debe ser un número",
      });
    }

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const existe = await tx.detalles_compras.findFirst({
          where: {
            detalle_compra_id: idNum,
            fecha_eliminacion: null,
          },
        });

        if (!existe) {
          throw new Error("No se encontró el detalle a eliminar");
        }

        await disminuirStockMaterial(tx, existe.material_id, existe.cantidad);

        const eliminado = await tx.detalles_compras.update({
          where: {
            detalle_compra_id: idNum,
          },
          data: {
            fecha_eliminacion: new Date(),
            fecha_actualizacion: new Date(),
          },
        });

        const total = await recalcularMontoTotal(tx, existe.compra_id);

        return {
          eliminado,
          total,
        };
      });

      res.json({
        ok: true,
        msg: "Detalle eliminado correctamente. El inventario fue actualizado.",
        id: resultado.eliminado.detalle_compra_id,
        monto_total: resultado.total,
      });
    } catch (error) {
      console.error("Error delete detalles_compras:", error);

      res.status(500).json({
        ok: false,
        msg: error.message || "Server error, something went wrong",
      });
    }
  }
}