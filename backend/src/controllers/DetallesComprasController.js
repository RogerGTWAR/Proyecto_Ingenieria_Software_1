//Falta-En Revision

import prisma from "../database.js";

async function recalcularMontoTotalCompra(compraId) {
  const detalles = await prisma.detalles_compras.findMany({
    where: { compra_id: compraId, fecha_eliminacion: null },
    select: { cantidad: true, precio_unitario: true }
  });
  const total = detalles.reduce((acc, d) => acc + (Number(d.cantidad) * Number(d.precio_unitario)), 0);
  await prisma.compras.update({
    where: { compra_id: compraId },
    data: { monto_total: total, fecha_actualizacion: new Date() }
  });
}

export default class DetallesComprasController {
  static async getAll(_req, res) {
    try {
      const items = await prisma.detalles_compras.findMany({
        where: { fecha_eliminacion: null },
        include: {
          compras: { select: { compra_id: true, numero_factura: true, estado: true } },
          productos: { select: { producto_id: true, nombre_producto: true, unidad_de_medida: true } }
        },
        orderBy: { detalle_compra_id: "asc" }
      });

      const data = items.map(i => ({
        ...i,
        compra: i.compras ? `${i.compras.numero_factura} (${i.compras.estado})` : null,
        producto: i.productos?.nombre_producto ?? null
      }));

      res.json({ ok: true, data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async getById(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id del detalle debe ser numérico" });

    try {
      const det = await prisma.detalles_compras.findFirst({
        where: { AND: [{ detalle_compra_id: idNum }, { fecha_eliminacion: null }] },
        include: {
          compras: { select: { compra_id: true, numero_factura: true, estado: true } },
          productos: { select: { producto_id: true, nombre_producto: true, unidad_de_medida: true } }
        }
      });

      if (!det) return res.status(404).json({ ok: false, msg: `No se encontró el detalle con id: ${idNum}` });

      res.json({
        ok: true,
        data: {
          ...det,
          compra: det.compras ? `${det.compras.numero_factura} (${det.compras.estado})` : null,
          producto: det.productos?.nombre_producto ?? null
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server Error, something went wrong" });
    }
  }

  static async create(req, res) {
    const { compra_id, producto_id, cantidad, precio_unitario } = req.body;

    if (compra_id === undefined || producto_id === undefined || cantidad === undefined || precio_unitario === undefined) {
      return res.status(400).json({ ok: false, msg: "Faltan campos obligatorios: compra_id, producto_id, cantidad y precio_unitario" });
    }

    const compraId = parseInt(compra_id);
    const productoId = parseInt(producto_id);
    const cant = parseInt(cantidad);
    const precio = Number(precio_unitario);

    if ([compraId, productoId, cant].some(isNaN) || isNaN(precio)) {
      return res.status(400).json({ ok: false, msg: "Los campos numéricos deben ser válidos" });
    }
    if (cant <= 0) return res.status(400).json({ ok: false, msg: "cantidad debe ser > 0" });
    if (precio < 0) return res.status(400).json({ ok: false, msg: "precio_unitario debe ser >= 0" });

    try {
      const compraOk = await prisma.compras.findFirst({
        where: { AND: [{ compra_id: compraId }, { fecha_eliminacion: null }] }
      });
      if (!compraOk) return res.status(400).json({ ok: false, msg: "La compra no existe o fue dada de baja" });

      const prodOk = await prisma.productos.findFirst({
        where: { AND: [{ producto_id: productoId }, { fecha_eliminacion: null }] }
      });
      if (!prodOk) return res.status(400).json({ ok: false, msg: "El producto no existe o fue dado de baja" });

      const nuevo = await prisma.detalles_compras.create({
        data: {
          compra_id: compraId,
          producto_id: productoId,
          cantidad: cant,
          precio_unitario: precio
        },
        include: {
          compras: { select: { compra_id: true, numero_factura: true, estado: true } },
          productos: { select: { producto_id: true, nombre_producto: true } }
        }
      });

      await recalcularMontoTotalCompra(compraId);

      res.status(201).json({
        ok: true,
        msg: "Detalle de compra creado correctamente",
        data: {
          ...nuevo,
          compra: nuevo.compras ? `${nuevo.compras.numero_factura} (${nuevo.compras.estado})` : null,
          producto: nuevo.productos?.nombre_producto ?? null
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id del detalle debe ser numérico" });

    try {
      const old = await prisma.detalles_compras.findUnique({ where: { detalle_compra_id: idNum } });
      if (!old || old.fecha_eliminacion !== null) {
        return res.status(404).json({ ok: false, msg: "No se encontró el detalle que se desea modificar" });
      }

      const { compra_id, producto_id, cantidad, precio_unitario } = req.body;

      let compraId = old.compra_id;
      if (req.body.hasOwnProperty("compra_id")) {
        const parsed = parseInt(compra_id);
        if (isNaN(parsed)) return res.status(400).json({ ok: false, msg: "compra_id debe ser numérico" });
        const compraOk = await prisma.compras.findFirst({
          where: { AND: [{ compra_id: parsed }, { fecha_eliminacion: null }] }
        });
        if (!compraOk) return res.status(400).json({ ok: false, msg: "La compra no existe o fue dada de baja" });
        compraId = parsed;
      }

      let productoId = old.producto_id;
      if (req.body.hasOwnProperty("producto_id")) {
        const parsed = parseInt(producto_id);
        if (isNaN(parsed)) return res.status(400).json({ ok: false, msg: "producto_id debe ser numérico" });
        const prodOk = await prisma.productos.findFirst({
          where: { AND: [{ producto_id: parsed }, { fecha_eliminacion: null }] }
        });
        if (!prodOk) return res.status(400).json({ ok: false, msg: "El producto no existe o fue dado de baja" });
        productoId = parsed;
      }

      let cant = old.cantidad;
      if (req.body.hasOwnProperty("cantidad")) {
        const parsed = parseInt(cantidad);
        if (isNaN(parsed) || parsed <= 0) return res.status(400).json({ ok: false, msg: "cantidad debe ser > 0" });
        cant = parsed;
      }

      let precio = old.precio_unitario;
      if (req.body.hasOwnProperty("precio_unitario")) {
        const parsed = Number(precio_unitario);
        if (isNaN(parsed) || parsed < 0) return res.status(400).json({ ok: false, msg: "precio_unitario debe ser >= 0" });
        precio = parsed;
      }

      const actualizado = await prisma.detalles_compras.update({
        where: { detalle_compra_id: idNum },
        data: {
          compra_id: compraId,
          producto_id: productoId,
          cantidad: cant,
          precio_unitario: precio,
          fecha_actualizacion: new Date()
        },
        include: {
          compras: { select: { compra_id: true, numero_factura: true, estado: true } },
          productos: { select: { producto_id: true, nombre_producto: true } }
        }
      });

      if (compraId !== old.compra_id) {
        await recalcularMontoTotalCompra(old.compra_id);
      }
      await recalcularMontoTotalCompra(compraId);

      res.json({
        ok: true,
        msg: "Detalle de compra actualizado correctamente",
        data: {
          ...actualizado,
          compra: actualizado.compras ? `${actualizado.compras.numero_factura} (${actualizado.compras.estado})` : null,
          producto: actualizado.productos?.nombre_producto ?? null
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id del detalle debe ser numérico" });

    try {
      const existe = await prisma.detalles_compras.findFirst({
        where: { AND: [{ detalle_compra_id: idNum }, { fecha_eliminacion: null }] }
      });
      if (!existe) return res.status(404).json({ ok: false, msg: "No se encontró el detalle que se desea eliminar" });

      const { detalle_compra_id, compra_id } = await prisma.detalles_compras.update({
        where: { detalle_compra_id: idNum },
        data: { fecha_eliminacion: new Date() }
      });

      await recalcularMontoTotalCompra(compra_id);

      res.json({ ok: true, msg: "Se eliminó el detalle correctamente", id: detalle_compra_id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }
}
