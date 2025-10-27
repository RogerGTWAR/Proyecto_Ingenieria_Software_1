//Listo
import prisma from "../database.js";

export default class ProveedoresController {
  static async getAll(_req, res) {
    try {
      let proveedores = await prisma.proveedores.findMany({
        where: { fecha_eliminacion: null },
        orderBy: { proveedor_id: "asc" },
        include: {
          categorias_proveedor: { select: { nombre_categoria: true } }
        }
      });

      proveedores = proveedores.map(p => ({
        ...p,
        categoria: p.categorias_proveedor?.nombre_categoria ?? null
      }));

      res.json({ ok: true, data: proveedores });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error, something went wrong" });
    }
  }

  static async getById(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id de proveedor debe ser un número" });

    try {
      let prov = await prisma.proveedores.findFirst({
        where: { AND: [{ proveedor_id: idNum }, { fecha_eliminacion: null }] },
        include: {
          categorias_proveedor: { select: { nombre_categoria: true } }
        }
      });

      if (!prov) return res.status(404).json({ ok: false, msg: `No se encontró el proveedor con id: ${idNum}` });

      prov = { ...prov, categoria: prov.categorias_proveedor?.nombre_categoria ?? null };
      res.json({ ok: true, data: prov });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server Error, something went wrong" });
    }
  }

  static async create(req, res) {
    const {
      categoria_proveedor_id,
      nombre_empresa,
      nombre_contacto,
      cargo_contacto,
      direccion,
      ciudad,
      pais,
      telefono,
      correo
    } = req.body;

    const catId = parseInt(categoria_proveedor_id);
    if (isNaN(catId)) return res.status(400).json({ ok: false, msg: "El id de categoría debe ser un número" });
    if (!nombre_empresa) return res.status(400).json({ ok: false, msg: "El nombre de la empresa es obligatorio" });

    const catOk = await prisma.categorias_proveedor.findFirst({
      where: { AND: [{ categoria_proveedor_id: catId }, { fecha_eliminacion: null }] }
    });
    if (!catOk) return res.status(400).json({ ok: false, msg: "La categoría no existe o fue dada de baja" });

    try {
      let prov = await prisma.proveedores.create({
        data: {
          categoria_proveedor_id: catId,
          nombre_empresa,
          nombre_contacto: nombre_contacto ?? null,
          cargo_contacto: cargo_contacto ?? null,
          direccion: direccion ?? null,
          ciudad: ciudad ?? null,
          pais: pais ?? null,
          telefono: telefono ?? null,
          correo: correo ?? null
        }
      });

      prov = await prisma.proveedores.findUnique({
        where: { proveedor_id: prov.proveedor_id },
        include: { categorias_proveedor: { select: { nombre_categoria: true } } }
      });

      prov = { ...prov, categoria: prov.categorias_proveedor?.nombre_categoria ?? null };

      res.status(201).json({ ok: true, msg: "Proveedor creado correctamente", data: prov });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async update(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id de proveedor debe ser un número" });

    const old = await prisma.proveedores.findUnique({ where: { proveedor_id: idNum } });
    if (!old || old.fecha_eliminacion !== null) {
      return res.status(404).json({ ok: false, msg: "No se encontró el proveedor que se desea modificar" });
    }

    const {
      categoria_proveedor_id,
      nombre_empresa,
      nombre_contacto,
      cargo_contacto,
      direccion,
      ciudad,
      pais,
      telefono,
      correo
    } = req.body;

    let catId = null;
    if (categoria_proveedor_id !== undefined) {
      catId = parseInt(categoria_proveedor_id);
      if (isNaN(catId)) return res.status(400).json({ ok: false, msg: "El id de categoría debe ser un número" });

      const catOk = await prisma.categorias_proveedor.findFirst({
        where: { AND: [{ categoria_proveedor_id: catId }, { fecha_eliminacion: null }] }
      });
      if (!catOk) return res.status(400).json({ ok: false, msg: "La categoría no existe o fue dada de baja" });
    }

    try {
      let prov = await prisma.proveedores.update({
        where: { proveedor_id: idNum },
        data: {
          categoria_proveedor_id: catId ?? old.categoria_proveedor_id,
          nombre_empresa: nombre_empresa ?? old.nombre_empresa,
          nombre_contacto: nombre_contacto ?? old.nombre_contacto,
          cargo_contacto: cargo_contacto ?? old.cargo_contacto,
          direccion: direccion ?? old.direccion,
          ciudad: ciudad ?? old.ciudad,
          pais: pais ?? old.pais,
          telefono: telefono ?? old.telefono,
          correo: correo ?? old.correo,
          fecha_actualizacion: new Date()
        }
      });

      prov = await prisma.proveedores.findUnique({
        where: { proveedor_id: prov.proveedor_id },
        include: { categorias_proveedor: { select: { nombre_categoria: true } } }
      });

      prov = { ...prov, categoria: prov.categorias_proveedor?.nombre_categoria ?? null };

      res.json({ ok: true, msg: "Proveedor actualizado correctamente", data: prov });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }

  static async delete(req, res) {
    const idNum = parseInt(req.params.id);
    if (isNaN(idNum)) return res.status(400).json({ ok: false, msg: "El id de proveedor debe ser un número" });

    const existe = await prisma.proveedores.findFirst({
      where: { AND: [{ proveedor_id: idNum }, { fecha_eliminacion: null }] }
    });
    if (!existe) return res.status(404).json({ ok: false, msg: "No se encontró el proveedor que se desea eliminar" });

    try {
      const { proveedor_id } = await prisma.proveedores.update({
        where: { proveedor_id: idNum },
        data: { fecha_eliminacion: new Date() }
      });

      res.json({ ok: true, msg: "Se eliminó el proveedor correctamente", id: proveedor_id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Server error something went wrong" });
    }
  }
}
