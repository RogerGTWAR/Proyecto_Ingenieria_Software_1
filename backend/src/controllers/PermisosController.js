import prisma from "../database.js";

export default class PermisosController {

  // ------------------------------------------------------------
  // 1. Obtener TODOS los menús
  // ------------------------------------------------------------
  static async getMenuAll(_req, res) {
    try {
      const menu = await prisma.menu.findMany({
        where: { }, // no usa eliminación lógica
        orderBy: { id_menu: "asc" },
      });

      return res.json({ ok: true, data: menu });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        msg: "Server error, something went wrong",
      });
    }
  }

  // ------------------------------------------------------------
  // 2. Obtener permisos asignados a un usuario
  // ------------------------------------------------------------
  static async getPermisosByUsuario(req, res) {
    const usuarioId = parseInt(req.params.usuarioId);

    if (isNaN(usuarioId)) {
      return res.status(400).json({
        ok: false,
        msg: "El ID del usuario debe ser numérico",
      });
    }

    try {
      const permisos = await prisma.permisos.findMany({
        where: {
          usuario_id: usuarioId,
          fecha_eliminacion: null,
        },
        include: {
          menu: true,
        },
        orderBy: {
          id_menu: "asc",
        },
      });

      return res.json({ ok: true, data: permisos });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        msg: "Server error, something went wrong",
      });
    }
  }

  // ------------------------------------------------------------
  // 3. Obtener MENÚS NO ASIGNADOS a un usuario
  // ------------------------------------------------------------
  static async getMenuSinAsignar(req, res) {
    const usuarioId = parseInt(req.params.usuarioId);

    if (isNaN(usuarioId))
      return res.status(400).json({
        ok: false,
        msg: "El ID del usuario debe ser numérico",
      });

    try {
      const asignados = await prisma.permisos.findMany({
        where: {
          usuario_id: usuarioId,
          fecha_eliminacion: null,
        },
        select: { id_menu: true },
      });

      const asignadosIds = asignados.map((p) => p.id_menu);

      const noAsignados = await prisma.menu.findMany({
        where: {
          id_menu: { notIn: asignadosIds.length > 0 ? asignadosIds : [0] },
        },
        orderBy: { id_menu: "asc" },
      });

      return res.json({ ok: true, data: noAsignados });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        msg: "Server error, something went wrong",
      });
    }
  }

  // ------------------------------------------------------------
  // 4. ASIGNAR permisos
  // ------------------------------------------------------------
  static async asignar(req, res) {
    try {
      const { usuario_id, menus } = req.body;

      if (!usuario_id || !menus || !Array.isArray(menus)) {
        return res.status(400).json({
          ok: false,
          msg: "Debe enviar usuario_id y un arreglo de menus",
        });
      }

      const usuarioId = parseInt(usuario_id);
      if (isNaN(usuarioId))
        return res.status(400).json({
          ok: false,
          msg: "usuario_id debe ser numérico",
        });

      const usuarioOk = await prisma.usuarios.findFirst({
        where: { usuario_id: usuarioId },
      });

      if (!usuarioOk)
        return res.status(404).json({
          ok: false,
          msg: "El usuario especificado no existe",
        });

      // Reactivación lógica si ya existía pero con fecha_eliminacion
      const creaciones = [];
      for (const menuId of menus) {
        const idMenuNum = parseInt(menuId);
        if (isNaN(idMenuNum)) continue;

        const existente = await prisma.permisos.findFirst({
          where: {
            usuario_id: usuarioId,
            id_menu: idMenuNum,
          },
        });

        // Caso 1: ya existe y está activo → nada que hacer
        if (existente && existente.fecha_eliminacion === null) {
          creaciones.push({ msg: "Ya existía", id_menu: idMenuNum });
          continue;
        }

        // Caso 2: reactivar (fecha_eliminacion != null)
        if (existente && existente.fecha_eliminacion !== null) {
          const actualizado = await prisma.permisos.update({
            where: { permiso_id: existente.permiso_id },
            data: {
              fecha_eliminacion: null,
              fecha_actualizacion: new Date(),
              estado: true,
            },
          });
          creaciones.push(actualizado);
          continue;
        }

        // Caso 3: crear nuevo permiso
        const nuevo = await prisma.permisos.create({
          data: {
            usuario_id: usuarioId,
            id_menu: idMenuNum,
          },
        });

        creaciones.push(nuevo);
      }

      return res.status(201).json({
        ok: true,
        msg: "Permisos asignados correctamente",
        data: creaciones,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        msg: "Server error, something went wrong",
      });
    }
  }

  // ------------------------------------------------------------
  // 5. REMOVER permisos (baja lógica)
  // ------------------------------------------------------------
  static async remover(req, res) {
    try {
      const { usuario_id, menus } = req.body;

      if (!usuario_id || !menus || !Array.isArray(menus)) {
        return res.status(400).json({
          ok: false,
          msg: "Debe enviar usuario_id y arreglo de menus",
        });
      }

      const usuarioId = parseInt(usuario_id);
      if (isNaN(usuarioId))
        return res.status(400).json({
          ok: false,
          msg: "usuario_id debe ser numérico",
        });

      const resultado = [];

      for (const menuId of menus) {
        const idMenuNum = parseInt(menuId);
        if (isNaN(idMenuNum)) continue;

        const permiso = await prisma.permisos.findFirst({
          where: {
            usuario_id: usuarioId,
            id_menu: idMenuNum,
            fecha_eliminacion: null,
          },
        });

        if (!permiso) {
          resultado.push({ msg: "No existía", id_menu: idMenuNum });
          continue;
        }

        const eliminado = await prisma.permisos.update({
          where: { permiso_id: permiso.permiso_id },
          data: {
            fecha_eliminacion: new Date(),
            fecha_actualizacion: new Date(),
            estado: false,
          },
        });

        resultado.push(eliminado);
      }

      return res.json({
        ok: true,
        msg: "Permisos removidos correctamente",
        data: resultado,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        msg: "Server error, something went wrong",
      });
    }
  }
}
