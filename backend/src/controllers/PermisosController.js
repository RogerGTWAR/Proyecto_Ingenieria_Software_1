import prisma from "../database.js";

export default class PermisosController {

  // ============================================================
  // 1. BUSCAR EMPLEADO POR DOCUMENTO (cédula)
  // ============================================================
  static async buscarEmpleado(req, res) {
    try {
      const { documento } = req.params;

      if (!documento)
        return res.status(400).json({ ok: false, msg: "Debe enviar el documento" });

      const empleado = await prisma.empleados.findFirst({
        where: { cedula: documento },
        include: {
          usuarios: true,
          roles: true
        }
      });

      if (!empleado)
        return res.status(404).json({ ok: false, msg: "Empleado no encontrado" });

      if (!empleado.usuarios || empleado.usuarios.length === 0)
        return res.status(400).json({
          ok: false,
          msg: "Empleado no tiene usuario asignado"
        });

      return res.json({ ok: true, data: empleado });

    } catch (error) {
      console.error("❌ Error buscarEmpleado:", error);
      return res.status(500).json({ ok: false, msg: "Error al buscar empleado" });
    }
  }

  // ============================================================
  // 2. Obtener TODOS LOS MENÚS
  // ============================================================
  static async getMenuAll(_req, res) {
    try {
      const data = await prisma.menu.findMany({
        orderBy: { id_menu: "asc" }
      });

      return res.json({ ok: true, data });

    } catch (error) {
      console.error("❌ Error getMenuAll:", error);
      return res.status(500).json({ ok: false, msg: "Error al obtener menús" });
    }
  }

  // ============================================================
  // 3. Obtener PERMISOS ASIGNADOS a un usuario
  // ============================================================
  static async getPermisosAsignados(req, res) {
    try {
      const usuarioId = Number(req.params.usuarioId);

      if (isNaN(usuarioId))
        return res.status(400).json({ ok: false, msg: "ID inválido" });

      const asignados = await prisma.permisos.findMany({
        where: {
          usuario_id: usuarioId,
          fecha_eliminacion: null
        },
        include: { menu: true },
        orderBy: { id_menu: "asc" }
      });

      return res.json({ ok: true, data: asignados });

    } catch (error) {
      console.error("❌ Error getPermisosAsignados:", error);
      return res.status(500).json({ ok: false, msg: "Error interno" });
    }
  }

  // ============================================================
  // 4. Obtener MENÚS NO ASIGNADOS
  // ============================================================
  static async getMenuSinAsignar(req, res) {
    try {
      const usuarioId = Number(req.params.usuarioId);

      if (isNaN(usuarioId))
        return res.status(400).json({ ok: false, msg: "ID inválido" });

      const asignados = await prisma.permisos.findMany({
        where: {
          usuario_id: usuarioId,
          fecha_eliminacion: null
        },
        select: { id_menu: true }
      });

      const idsAsignados = asignados.map(p => p.id_menu);

      const noAsignados = await prisma.menu.findMany({
        where: {
          id_menu: {
            notIn: idsAsignados.length > 0 ? idsAsignados : [0]
          }
        },
        orderBy: { id_menu: "asc" }
      });

      return res.json({ ok: true, data: noAsignados });

    } catch (error) {
      console.error("❌ Error getMenuSinAsignar:", error);
      return res.status(500).json({ ok: false, msg: "Error interno" });
    }
  }

  // ============================================================
  // 5. ASIGNAR permisos
  // ============================================================
  static async asignar(req, res) {
    try {
      const { usuario_id, menus } = req.body;

      if (!usuario_id || !menus || !Array.isArray(menus))
        return res.status(400).json({
          ok: false,
          msg: "Debe enviar usuario_id y un arreglo de menus"
        });

      const usuarioId = Number(usuario_id);
      const resultado = [];

      for (const menu of menus) {
        const menuId = Number(menu);

        const permiso = await prisma.permisos.findFirst({
          where: { usuario_id: usuarioId, id_menu: menuId }
        });

        // Caso: existe pero eliminado → reactivar
        if (permiso && permiso.fecha_eliminacion !== null) {
          const updated = await prisma.permisos.update({
            where: { permiso_id: permiso.permiso_id },
            data: {
              fecha_eliminacion: null,
              fecha_actualizacion: new Date(),
              estado: true
            }
          });
          resultado.push(updated);
          continue;
        }

        // Caso: no existe → crear
        if (!permiso) {
          const created = await prisma.permisos.create({
            data: {
              usuario_id: usuarioId,
              id_menu: menuId
            }
          });
          resultado.push(created);
        }
      }

      return res.json({
        ok: true,
        msg: "Permisos asignados correctamente",
        data: resultado
      });

    } catch (error) {
      console.error("❌ Error asignar:", error);
      return res.status(500).json({ ok: false, msg: "Error al asignar permisos" });
    }
  }

  // ============================================================
  // 6. REMOVER permisos (baja lógica)
  // ============================================================
  static async remover(req, res) {
    try {
      const { usuario_id, menus } = req.body;

      if (!usuario_id || !menus || !Array.isArray(menus))
        return res.status(400).json({
          ok: false,
          msg: "Debe enviar usuario_id y arreglo de menus"
        });

      const usuarioId = Number(usuario_id);
      const resultado = [];

      for (const id of menus) {
        const menuId = Number(id);

        const permiso = await prisma.permisos.findFirst({
          where: {
            usuario_id: usuarioId,
            id_menu: menuId,
            fecha_eliminacion: null
          }
        });

        if (!permiso) continue;

        const deleted = await prisma.permisos.update({
          where: { permiso_id: permiso.permiso_id },
          data: {
            fecha_eliminacion: new Date(),
            fecha_actualizacion: new Date(),
            estado: false
          }
        });

        resultado.push(deleted);
      }

      return res.json({
        ok: true,
        msg: "Permisos removidos correctamente",
        data: resultado
      });

    } catch (error) {
      console.error("❌ Error remover:", error);
      return res.status(500).json({ ok: false, msg: "Error al remover permisos" });
    }
  }
}
