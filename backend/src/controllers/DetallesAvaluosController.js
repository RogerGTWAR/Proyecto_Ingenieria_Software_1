import prisma from "../database.js";

const mapDetalle = (row) => {
  const cantidad = Number(row.cantidad ?? 0);
  const precioUnit = Number(row.precio_unitario ?? 0);

  const costo_venta = cantidad * precioUnit;
  const iva = costo_venta * 0.15;
  const total_costo_venta = costo_venta + iva;

  return {
    ...row,
    costo_venta: Number(costo_venta.toFixed(2)),
    iva: Number(iva.toFixed(2)),
    total_costo_venta: Number(total_costo_venta.toFixed(2)),
  };
};

async function recalcularMontoEjecutado(tx, avaluo_id) {
  const detalles = await tx.detalles_avaluos.findMany({
    where: {
      avaluo_id: Number(avaluo_id),
      fecha_eliminacion: null,
    },
  });

  let total = 0;

  for (const d of detalles) {
    const m = mapDetalle(d);
    total += m.total_costo_venta;
  }

  await tx.avaluos.update({
    where: {
      avaluo_id: Number(avaluo_id),
    },
    data: {
      monto_ejecutado: Number(total.toFixed(2)),
      fecha_actualizacion: new Date(),
    },
  });

  return Number(total.toFixed(2));
}

async function obtenerMaterialesDelServicio(tx, servicioId) {
  const materialesServicio = await tx.costos_directos_servicios.findMany({
    where: {
      servicio_id: Number(servicioId),
      fecha_eliminacion: null,
    },
    include: {
      material_id_materiales: true,
    },
  });

  if (materialesServicio.length === 0) {
    throw new Error(
      "El servicio no tiene materiales asignados en costos directos."
    );
  }

  return materialesServicio;
}

async function disminuirInventarioPorServicio(tx, servicioId, cantidadServicio) {
  const materialesServicio = await obtenerMaterialesDelServicio(tx, servicioId);

  for (const item of materialesServicio) {
    const materialId = Number(item.material_id);
    const cantidadNecesaria =
      Number(item.cantidad_material) * Number(cantidadServicio);

    const material = await tx.materiales.findFirst({
      where: {
        material_id: materialId,
        fecha_eliminacion: null,
      },
    });

    if (!material) {
      throw new Error(
        `El material con ID ${materialId} no existe o fue eliminado.`
      );
    }

    const stockActual = Number(material.cantidad_en_stock);

    if (stockActual < cantidadNecesaria) {
      throw new Error(
        `Stock insuficiente para "${material.nombre_material}". Stock actual: ${stockActual}, cantidad requerida: ${cantidadNecesaria}.`
      );
    }

    await tx.materiales.update({
      where: {
        material_id: materialId,
      },
      data: {
        cantidad_en_stock: {
          decrement: cantidadNecesaria,
        },
        fecha_actualizacion: new Date(),
      },
    });
  }
}

async function devolverInventarioPorServicio(tx, servicioId, cantidadServicio) {
  const materialesServicio = await obtenerMaterialesDelServicio(tx, servicioId);

  for (const item of materialesServicio) {
    const materialId = Number(item.material_id);
    const cantidadDevolver =
      Number(item.cantidad_material) * Number(cantidadServicio);

    await tx.materiales.update({
      where: {
        material_id: materialId,
      },
      data: {
        cantidad_en_stock: {
          increment: cantidadDevolver,
        },
        fecha_actualizacion: new Date(),
      },
    });
  }
}

export default class DetallesAvaluosController {
  static async getAll(_req, res) {
    try {
      const data = await prisma.detalles_avaluos.findMany({
        where: {
          fecha_eliminacion: null,
        },
        include: {
          Servicios: true,
          Avaluos: true,
        },
        orderBy: {
          detalle_avaluo_id: "asc",
        },
      });

      res.json({
        ok: true,
        data: data.map(mapDetalle),
      });
    } catch (error) {
      console.error("Error getAll:", error);

      res.status(500).json({
        ok: false,
        msg: "Error interno al obtener detalles del avalúo.",
      });
    }
  }

  static async getById(req, res) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        msg: "ID inválido.",
      });
    }

    try {
      const detalle = await prisma.detalles_avaluos.findFirst({
        where: {
          detalle_avaluo_id: id,
          fecha_eliminacion: null,
        },
        include: {
          Servicios: true,
          Avaluos: true,
        },
      });

      if (!detalle) {
        return res.status(404).json({
          ok: false,
          msg: "No encontrado.",
        });
      }

      res.json({
        ok: true,
        data: mapDetalle(detalle),
      });
    } catch (error) {
      console.error("Error getById:", error);

      res.status(500).json({
        ok: false,
        msg: "Error interno.",
      });
    }
  }

  static async create(req, res) {
    try {
      const {
        avaluo_id,
        servicio_id,
        actividad,
        unidad_de_medida,
        cantidad,
      } = req.body;

      if (
        !avaluo_id ||
        !servicio_id ||
        !actividad ||
        !unidad_de_medida ||
        cantidad == null
      ) {
        return res.status(400).json({
          ok: false,
          msg: "Campos obligatorios faltantes.",
        });
      }

      if (Number(cantidad) <= 0) {
        return res.status(400).json({
          ok: false,
          msg: "La cantidad debe ser mayor que cero.",
        });
      }

      const resultado = await prisma.$transaction(async (tx) => {
        const avaluo = await tx.avaluos.findFirst({
          where: {
            avaluo_id: Number(avaluo_id),
            fecha_eliminacion: null,
          },
        });

        if (!avaluo) {
          throw new Error("El avalúo no existe.");
        }

        const dup = await tx.detalles_avaluos.findFirst({
          where: {
            avaluo_id: Number(avaluo_id),
            servicio_id: Number(servicio_id),
            fecha_eliminacion: null,
          },
        });

        if (dup) {
          throw new Error("Este servicio ya está asignado a este avalúo.");
        }

        const serv = await tx.servicios.findFirst({
          where: {
            servicio_id: Number(servicio_id),
            fecha_eliminacion: null,
          },
        });

        if (!serv) {
          throw new Error("El servicio no existe.");
        }

        await disminuirInventarioPorServicio(
          tx,
          Number(servicio_id),
          Number(cantidad)
        );

        const precio_unitario =
          Number(serv.total_costo_directo) + Number(serv.total_costo_indirecto);

        const nuevo = await tx.detalles_avaluos.create({
          data: {
            avaluo_id: Number(avaluo_id),
            servicio_id: Number(servicio_id),
            actividad,
            unidad_de_medida,
            cantidad: Number(cantidad),
            precio_unitario,
          },
        });

        const montoEjecutado = await recalcularMontoEjecutado(
          tx,
          Number(avaluo_id)
        );

        return {
          nuevo,
          montoEjecutado,
        };
      });

      res.status(201).json({
        ok: true,
        msg: "Detalle agregado. El inventario fue actualizado.",
        data: mapDetalle(resultado.nuevo),
        monto_ejecutado: resultado.montoEjecutado,
      });
    } catch (error) {
      console.error("Error create:", error);

      res.status(500).json({
        ok: false,
        msg: error.message || "Error interno al crear.",
      });
    }
  }

  static async update(req, res) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          ok: false,
          msg: "ID inválido.",
        });
      }

      const {
        servicio_id,
        actividad,
        unidad_de_medida,
        cantidad,
      } = req.body;

      if (cantidad !== undefined && Number(cantidad) <= 0) {
        return res.status(400).json({
          ok: false,
          msg: "La cantidad debe ser mayor que cero.",
        });
      }

      const resultado = await prisma.$transaction(async (tx) => {
        const old = await tx.detalles_avaluos.findFirst({
          where: {
            detalle_avaluo_id: id,
            fecha_eliminacion: null,
          },
        });

        if (!old) {
          throw new Error("No encontrado.");
        }

        const nuevoServicioId =
          servicio_id !== undefined
            ? Number(servicio_id)
            : Number(old.servicio_id);

        const nuevaCantidad =
          cantidad !== undefined ? Number(cantidad) : Number(old.cantidad);

        let precio_unitario = Number(old.precio_unitario);

        if (Number(nuevoServicioId) !== Number(old.servicio_id)) {
          const dup = await tx.detalles_avaluos.findFirst({
            where: {
              avaluo_id: Number(old.avaluo_id),
              servicio_id: nuevoServicioId,
              fecha_eliminacion: null,
            },
          });

          if (dup) {
            throw new Error("Ese servicio ya está asignado a este avalúo.");
          }

          const servNuevo = await tx.servicios.findFirst({
            where: {
              servicio_id: nuevoServicioId,
              fecha_eliminacion: null,
            },
          });

          if (!servNuevo) {
            throw new Error("El nuevo servicio no existe.");
          }

          await devolverInventarioPorServicio(
            tx,
            old.servicio_id,
            old.cantidad
          );

          await disminuirInventarioPorServicio(
            tx,
            nuevoServicioId,
            nuevaCantidad
          );

          precio_unitario =
            Number(servNuevo.total_costo_directo) +
            Number(servNuevo.total_costo_indirecto);
        } else {
          const diferencia = nuevaCantidad - Number(old.cantidad);

          if (diferencia > 0) {
            await disminuirInventarioPorServicio(
              tx,
              old.servicio_id,
              diferencia
            );
          }

          if (diferencia < 0) {
            await devolverInventarioPorServicio(
              tx,
              old.servicio_id,
              Math.abs(diferencia)
            );
          }
        }

        const upd = await tx.detalles_avaluos.update({
          where: {
            detalle_avaluo_id: id,
          },
          data: {
            servicio_id: nuevoServicioId,
            actividad: actividad ?? old.actividad,
            unidad_de_medida: unidad_de_medida ?? old.unidad_de_medida,
            cantidad: nuevaCantidad,
            precio_unitario,
            fecha_actualizacion: new Date(),
          },
        });

        const montoEjecutado = await recalcularMontoEjecutado(
          tx,
          upd.avaluo_id
        );

        return {
          upd,
          montoEjecutado,
        };
      });

      res.json({
        ok: true,
        msg: "Actualizado correctamente. El inventario fue ajustado.",
        data: mapDetalle(resultado.upd),
        monto_ejecutado: resultado.montoEjecutado,
      });
    } catch (error) {
      console.error("Error update:", error);

      res.status(500).json({
        ok: false,
        msg: error.message || "Error al actualizar.",
      });
    }
  }

  static async delete(req, res) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          ok: false,
          msg: "ID inválido.",
        });
      }

      const resultado = await prisma.$transaction(async (tx) => {
        const old = await tx.detalles_avaluos.findFirst({
          where: {
            detalle_avaluo_id: id,
            fecha_eliminacion: null,
          },
        });

        if (!old) {
          throw new Error("No encontrado.");
        }

        await devolverInventarioPorServicio(
          tx,
          old.servicio_id,
          old.cantidad
        );

        const eliminado = await tx.detalles_avaluos.update({
          where: {
            detalle_avaluo_id: id,
          },
          data: {
            fecha_eliminacion: new Date(),
            fecha_actualizacion: new Date(),
          },
        });

        const montoEjecutado = await recalcularMontoEjecutado(
          tx,
          old.avaluo_id
        );

        return {
          eliminado,
          montoEjecutado,
        };
      });

      res.json({
        ok: true,
        msg: "Eliminado correctamente. El inventario fue devuelto.",
        id: resultado.eliminado.detalle_avaluo_id,
        monto_ejecutado: resultado.montoEjecutado,
      });
    } catch (error) {
      console.error("Error delete:", error);

      res.status(500).json({
        ok: false,
        msg: error.message || "Error al eliminar.",
      });
    }
  }
}