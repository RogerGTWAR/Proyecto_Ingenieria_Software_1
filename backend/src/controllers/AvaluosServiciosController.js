//Falta-En Revision
import prisma from "../database.js";

async function recalcularMontoAvaluo(avaluoId) {
  const filas = await prisma.avaluos_servicios.findMany({
    where: { avaluo_id: avaluoId, fecha_eliminacion: null },
    select: { cantidad: true, precio_unitario: true }
  });
  const total = filas.reduce((acc, f) => acc + Number(f.cantidad) * Number(f.precio_unitario), 0);
  await prisma.avaluos.update({
    where: { avaluo_id: avaluoId },
    data: { monto_ejecutado: total, fecha_actualizacion: new Date() }
  });
}

export default class AvaluosServiciosController {
  static async getAll(_req, res) {
    try {
      const rows = await prisma.avaluos_servicios.findMany({
        where: { fecha_eliminacion: null },
        include: {
          avaluos:   { select: { avaluo_id: true, descripcion: true } },
          servicios: { select: { servicio_id: true, nombre_servicio: true, unidad_de_medida: true } }
        },
        orderBy: { avaluo_servicio_id: "asc" }
      });

      const data = rows.map(r => ({
        ...r,
        avaluo: r.avaluos?.descripcion ?? null,
        servicio: r.servicios?.nombre_servicio ?? null
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
      const row = await prisma.avaluos_servicios.findFirst({
        where: { AND: [{ avaluo_servicio_id: idNum }, { fecha_eliminacion: null }] },
        include: {
          avaluos:   { select: { avaluo_id: true, descripcion: true } },
          servicios: { select: { servicio_id: true, nombre_servicio: true, unidad_de_medida: true } }
        }
      });

      if (!row) return res.status(404).json({ ok: false, msg: `No se encontró el registro con id: ${idNum}` });

      res.json({
        ok: true,
        data: {
          ...row,
          avaluo: row.avaluos?.descripcion ?? null,
          servicio: row.servicios?.nombre_servicio ?? null
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server Error, something went wrong" });
    }
  }

  static async create(req, res) {
    const { avaluo_id, servicio_id, cantidad, precio_unitario, observaciones } = req.body;

    if ([avaluo_id, servicio_id, cantidad, precio_unitario].some(v => v === undefined)) {
      return res.status(400).json({ ok: false, msg: "Faltan campos obligatorios: avaluo_id, servicio_id, cantidad y precio_unitario" });
    }

    const avalId = parseInt(avaluo_id);
    const servId = parseInt(servicio_id);
    const cant   = parseInt(cantidad);
    const precio = Number(precio_unitario);

    if ([avalId, servId, cant].some(isNaN) || isNaN(precio)) {
      return res.status(400).json({ ok: false, msg: "Los campos numéricos deben ser válidos" });
    }
    if (cant <= 0)  return res.status(400).json({ ok: false, msg: "cantidad debe ser > 0" });
    if (precio < 0) return res.status(400).json({ ok: false, msg: "precio_unitario debe ser >= 0" });

    const avalOk = await prisma.avaluos.findFirst({
      where: { AND: [{ avaluo_id: avalId }, { fecha_eliminacion: null }] }
    });
    if (!avalOk) return res.status(400).json({ ok: false, msg: "El avalúo no existe o fue dado de baja" });

    const servOk = await prisma.servicios.findFirst({
      where: { AND: [{ servicio_id: servId }, { fecha_eliminacion: null }] }
    });
    if (!servOk) return res.status(400).json({ ok: false, msg: "El servicio no existe o fue dado de baja" });

    const dup = await prisma.avaluos_servicios.findFirst({
      where: {
        AND: [
          { avaluo_id: avalId },
          { servicio_id: servId },
          { fecha_eliminacion: null }
        ]
      }
    });
    if (dup) {
      return res.status(400).json({ ok: false, msg: "Ya existe un registro activo para este avalúo y servicio" });
    }

    try {
      const nuevo = await prisma.avaluos_servicios.create({
        data: {
          avaluo_id: avalId,
          servicio_id: servId,
          cantidad: cant,
          precio_unitario: precio,
          observaciones: observaciones?.trim() ?? null
        },
        include: {
          avaluos:   { select: { avaluo_id: true, descripcion: true } },
          servicios: { select: { servicio_id: true, nombre_servicio: true } }
        }
      });

      await recalcularMontoAvaluo(avalId);

      res.status(201).json({
        ok: true,
        msg: "Registro creado correctamente",
        data: {
          ...nuevo,
          avaluo: nuevo.avaluos?.descripcion ?? null,
          servicio: nuevo.servicios?.nombre_servicio ?? null
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
      const old = await prisma.avaluos_servicios.findUnique({ where: { avaluo_servicio_id: idNum } });
      if (!old || old.fecha_eliminacion !== null) {
        return res.status(404).json({ ok: false, msg: "No se encontró el registro que se desea modificar" });
      }

      const { avaluo_id, servicio_id, cantidad, precio_unitario, observaciones } = req.body;

      let avalId = old.avaluo_id;
      if (req.body.hasOwnProperty("avaluo_id")) {
        const parsed = parseInt(avaluo_id);
        if (isNaN(parsed)) return res.status(400).json({ ok: false, msg: "avaluo_id debe ser numérico" });
        const ok = await prisma.avaluos.findFirst({ where: { AND: [{ avaluo_id: parsed }, { fecha_eliminacion: null }] } });
        if (!ok) return res.status(400).json({ ok: false, msg: "El avalúo no existe o fue dado de baja" });
        avalId = parsed;
      }

      let servId = old.servicio_id;
      if (req.body.hasOwnProperty("servicio_id")) {
        const parsed = parseInt(servicio_id);
        if (isNaN(parsed)) return res.status(400).json({ ok: false, msg: "servicio_id debe ser numérico" });
        const ok = await prisma.servicios.findFirst({ where: { AND: [{ servicio_id: parsed }, { fecha_eliminacion: null }] } });
        if (!ok) return res.status(400).json({ ok: false, msg: "El servicio no existe o fue dado de baja" });
        servId = parsed;
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

      if (avalId !== old.avaluo_id || servId !== old.servicio_id) {
        const dup = await prisma.avaluos_servicios.findFirst({
          where: {
            AND: [
              { avaluo_id: avalId },
              { servicio_id: servId },
              { fecha_eliminacion: null },
              { avaluo_servicio_id: { not: idNum } }
            ]
          }
        });
        if (dup) return res.status(400).json({ ok: false, msg: "Ya existe otro registro activo para este avalúo y servicio" });
      }

      const actualizado = await prisma.avaluos_servicios.update({
        where: { avaluo_servicio_id: idNum },
        data: {
          avaluo_id: avalId,
          servicio_id: servId,
          cantidad: cant,
          precio_unitario: precio,
          observaciones: observaciones !== undefined ? (observaciones?.trim() ?? null) : old.observaciones,
          fecha_actualizacion: new Date()
        },
        include: {
          avaluos:   { select: { avaluo_id: true, descripcion: true } },
          servicios: { select: { servicio_id: true, nombre_servicio: true } }
        }
      });

      if (avalId !== old.avaluo_id) {
        await recalcularMontoAvaluo(old.avaluo_id);
      }
      await recalcularMontoAvaluo(avalId);

      res.json({
        ok: true,
        msg: "Registro actualizado correctamente",
        data: {
          ...actualizado,
          avaluo: actualizado.avaluos?.descripcion ?? null,
          servicio: actualizado.servicios?.nombre_servicio ?? null
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
      const existe = await prisma.avaluos_servicios.findFirst({
        where: { AND: [{ avaluo_servicio_id: idNum }, { fecha_eliminacion: null }] }
      });
      if (!existe) return res.status(404).json({ ok: false, msg: "No se encontró el registro que se desea eliminar" });

      const { avaluo_servicio_id, avaluo_id } = await prisma.avaluos_servicios.update({
        where: { avaluo_servicio_id: idNum },
        data: { fecha_eliminacion: new Date() }
      });

      await recalcularMontoAvaluo(avaluo_id);

      res.json({ ok: true, msg: "Se eliminó el registro correctamente", id: avaluo_servicio_id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }
}
