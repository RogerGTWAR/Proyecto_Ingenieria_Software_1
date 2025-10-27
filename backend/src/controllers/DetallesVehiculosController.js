//Falta-En Revision

import prisma from "../database.js";

export default class DetallesVehiculosController {
  static async hayTraslapeAsignacion({ empleadoId, vehiculoId, fInicio, fFin, excluirId = null }) {
    const baseWhere = {
      fecha_eliminacion: null,
      OR: [
        {
          vehiculo_id: vehiculoId,
          AND: [
            { fecha_asignacion: { lte: fFin ?? new Date("9999-12-31") } },
            { OR: [{ fecha_fin_asignacion: null }, { fecha_fin_asignacion: { gte: fInicio } }] }
          ]
        },
        {
          empleado_id: empleadoId,
          AND: [
            { fecha_asignacion: { lte: fFin ?? new Date("9999-12-31") } },
            { OR: [{ fecha_fin_asignacion: null }, { fecha_fin_asignacion: { gte: fInicio } }] }
          ]
        }
      ]
    };

    if (excluirId !== null) {
      baseWhere.detalle_vehiculo_id = { not: excluirId };
    }

    const existe = await prisma.detalles_vehiculos.findFirst({ where: baseWhere });
    return !!existe;
  }

  static async getAll(_req, res) {
    try {
      const detalles = await prisma.detalles_vehiculos.findMany({
        where: { fecha_eliminacion: null },
        include: {
          empleados: { select: { empleado_id: true, nombres: true, apellidos: true } },
          vehiculos: { select: { vehiculo_id: true, placa: true, marca: true, modelo: true } }
        },
        orderBy: { detalle_vehiculo_id: "asc" }
      });

      const data = detalles.map(d => ({
        ...d,
        empleado: d.empleados ? `${d.empleados.nombres} ${d.empleados.apellidos}`.trim() : null,
        vehiculo: d.vehiculos ? `${d.vehiculos.placa} (${d.vehiculos.marca} ${d.vehiculos.modelo})` : null
      }));

      res.json({ ok: true, data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async getById(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id del detalle debe ser un número" });

    try {
      const det = await prisma.detalles_vehiculos.findFirst({
        where: { AND: [{ detalle_vehiculo_id: idNum }, { fecha_eliminacion: null }] },
        include: {
          empleados: { select: { empleado_id: true, nombres: true, apellidos: true } },
          vehiculos: { select: { vehiculo_id: true, placa: true, marca: true, modelo: true } }
        }
      });

      if (!det) return res.status(404).json({ ok: false, msg: `No se encontró el detalle con id: ${idNum}` });

      res.json({
        ok: true,
        data: {
          ...det,
          empleado: det.empleados ? `${det.empleados.nombres} ${det.empleados.apellidos}`.trim() : null,
          vehiculo: det.vehiculos ? `${det.vehiculos.placa} (${det.vehiculos.marca} ${det.vehiculos.modelo})` : null
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server Error, something went wrong" });
    }
  }

  static async create(req, res) {
    const {
      empleado_id,
      vehiculo_id,
      fecha_asignacion,
      fecha_fin_asignacion,
      descripcion
    } = req.body;

    if (empleado_id === undefined || vehiculo_id === undefined || !fecha_asignacion) {
      return res.status(400).json({ ok: false, msg: "Faltan campos obligatorios: empleado_id, vehiculo_id y fecha_asignacion" });
    }

    const empleadoId = parseInt(empleado_id);
    const vehiculoId = parseInt(vehiculo_id);
    if ([empleadoId, vehiculoId].some(isNaN)) {
      return res.status(400).json({ ok: false, msg: "empleado_id y vehiculo_id deben ser numéricos" });
    }

    const fInicio = new Date(fecha_asignacion);
    if (isNaN(fInicio.getTime())) return res.status(400).json({ ok: false, msg: "fecha_asignacion no es válida" });

    let fFin = null;
    if (fecha_fin_asignacion) {
      fFin = new Date(fecha_fin_asignacion);
      if (isNaN(fFin.getTime())) return res.status(400).json({ ok: false, msg: "fecha_fin_asignacion no es válida" });
      if (fFin < fInicio) return res.status(400).json({ ok: false, msg: "fecha_fin_asignacion no puede ser anterior a fecha_asignacion" });
    }

    try {
      const empOk = await prisma.empleados.findFirst({
        where: { AND: [{ empleado_id: empleadoId }, { fecha_eliminacion: null }] }
      });
      if (!empOk) return res.status(400).json({ ok: false, msg: "El empleado no existe o fue dado de baja" });

      const vehOk = await prisma.vehiculos.findFirst({
        where: { AND: [{ vehiculo_id: vehiculoId }, { fecha_eliminacion: null }] }
      });
      if (!vehOk) return res.status(400).json({ ok: false, msg: "El vehículo no existe o fue dado de baja" });

      const hayTraslape = await DetallesVehiculosController.hayTraslapeAsignacion({
        empleadoId,
        vehiculoId,
        fInicio,
        fFin
      });
      if (hayTraslape) {
        return res.status(409).json({ ok: false, msg: "Existe una asignación vigente o traslapada para este vehículo o para este empleado en ese período" });
      }

      const nuevo = await prisma.detalles_vehiculos.create({
        data: {
          empleado_id: empleadoId,
          vehiculo_id: vehiculoId,
          fecha_asignacion: fInicio,
          fecha_fin_asignacion: fFin,
          descripcion: descripcion?.trim() ?? null
        },
        include: {
          empleados: { select: { empleado_id: true, nombres: true, apellidos: true } },
          vehiculos: { select: { vehiculo_id: true, placa: true, marca: true, modelo: true } }
        }
      });

      res.status(201).json({
        ok: true,
        msg: "Asignación creada correctamente",
        data: {
          ...nuevo,
          empleado: `${nuevo.empleados.nombres} ${nuevo.empleados.apellidos}`.trim(),
          vehiculo: `${nuevo.vehiculos.placa} (${nuevo.vehiculos.marca} ${nuevo.vehiculos.modelo})`
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id del detalle debe ser un número" });

    try {
      const old = await prisma.detalles_vehiculos.findUnique({ where: { detalle_vehiculo_id: idNum } });
      if (!old || old.fecha_eliminacion !== null) {
        return res.status(404).json({ ok: false, msg: "No se encontró el detalle que se desea modificar" });
      }

      const {
        empleado_id,
        vehiculo_id,
        fecha_asignacion,
        fecha_fin_asignacion,
        descripcion
      } = req.body;

      let empleadoId = old.empleado_id;
      if (req.body.hasOwnProperty("empleado_id")) {
        const parsed = parseInt(empleado_id);
        if (isNaN(parsed)) return res.status(400).json({ ok: false, msg: "empleado_id debe ser numérico" });
        const empOk = await prisma.empleados.findFirst({
          where: { AND: [{ empleado_id: parsed }, { fecha_eliminacion: null }] }
        });
        if (!empOk) return res.status(400).json({ ok: false, msg: "El empleado no existe o fue dado de baja" });
        empleadoId = parsed;
      }

      let vehiculoId = old.vehiculo_id;
      if (req.body.hasOwnProperty("vehiculo_id")) {
        const parsed = parseInt(vehiculo_id);
        if (isNaN(parsed)) return res.status(400).json({ ok: false, msg: "vehiculo_id debe ser numérico" });
        const vehOk = await prisma.vehiculos.findFirst({
          where: { AND: [{ vehiculo_id: parsed }, { fecha_eliminacion: null }] }
        });
        if (!vehOk) return res.status(400).json({ ok: false, msg: "El vehículo no existe o fue dado de baja" });
        vehiculoId = parsed;
      }

      let fInicio = old.fecha_asignacion;
      if (req.body.hasOwnProperty("fecha_asignacion")) {
        const parsed = new Date(fecha_asignacion);
        if (isNaN(parsed.getTime())) return res.status(400).json({ ok: false, msg: "fecha_asignacion no es válida" });
        fInicio = parsed;
      }

      let fFin = old.fecha_fin_asignacion;
      if (req.body.hasOwnProperty("fecha_fin_asignacion")) {
        if (fecha_fin_asignacion === null) {
          fFin = null;
        } else {
          const parsed = new Date(fecha_fin_asignacion);
          if (isNaN(parsed.getTime())) return res.status(400).json({ ok: false, msg: "fecha_fin_asignacion no es válida" });
          fFin = parsed;
        }
      }

      if (fFin && fFin < fInicio) {
        return res.status(400).json({ ok: false, msg: "fecha_fin_asignacion no puede ser anterior a fecha_asignacion" });
      }

      const hayTraslape = await DetallesVehiculosController.hayTraslapeAsignacion({
        empleadoId,
        vehiculoId,
        fInicio,
        fFin,
        excluirId: idNum
      });
      if (hayTraslape) {
        return res.status(409).json({ ok: false, msg: "Existe una asignación vigente o traslapada para este vehículo o para este empleado en ese período" });
      }

      const actualizado = await prisma.detalles_vehiculos.update({
        where: { detalle_vehiculo_id: idNum },
        data: {
          empleado_id: empleadoId,
          vehiculo_id: vehiculoId,
          fecha_asignacion: fInicio,
          fecha_fin_asignacion: fFin,
          descripcion: descripcion !== undefined ? (descripcion?.trim() ?? null) : old.descripcion,
          fecha_actualizacion: new Date()
        },
        include: {
          empleados: { select: { empleado_id: true, nombres: true, apellidos: true } },
          vehiculos: { select: { vehiculo_id: true, placa: true, marca: true, modelo: true } }
        }
      });

      res.json({
        ok: true,
        msg: "Asignación actualizada correctamente",
        data: {
          ...actualizado,
          empleado: `${actualizado.empleados.nombres} ${actualizado.empleados.apellidos}`.trim(),
          vehiculo: `${actualizado.vehiculos.placa} (${actualizado.vehiculos.marca} ${actualizado.vehiculos.modelo})`
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id del detalle debe ser un número" });

    try {
      const existe = await prisma.detalles_vehiculos.findFirst({
        where: { AND: [{ detalle_vehiculo_id: idNum }, { fecha_eliminacion: null }] }
      });
      if (!existe) return res.status(404).json({ ok: false, msg: "No se encontró el detalle que se desea eliminar" });

      const { detalle_vehiculo_id } = await prisma.detalles_vehiculos.update({
        where: { detalle_vehiculo_id: idNum },
        data: { fecha_eliminacion: new Date() }
      });

      res.json({ ok: true, msg: "Se eliminó la asignación correctamente", id: detalle_vehiculo_id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }
}
