import { api } from "./api.js";

const extract = (res) => {
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
};

const toUI = (m) => ({
  id: m.material_id ?? m.id,
  categoria_id: m.categoria_id ?? null,
  categoriaNombre: m.categorias?.nombre_categoria ?? "Sin categoría",
  nombre_material: m.nombre_material ?? m.nombre_producto ?? "",
  descripcion: m.descripcion ?? "",
  unidad_de_medida: m.unidad_de_medida ?? "",
  cantidad_en_stock: Number(m.cantidad_en_stock ?? 0),
  stock_minimo: Number(m.stock_minimo ?? 10),
  precio_unitario: Number(m.precio_unitario ?? 0),
  movimientos_count: m._count?.movimientos_inventario ?? 0,
  alertas_count: m._count?.alertas_inventario ?? 0,
});

export const fetchMateriales = async () => {
  const res = await api("/materiales");
  const payload = extract(res);
  const list = Array.isArray(payload) ? payload : [];

  return list.map(toUI);
};

export const fetchMaterialById = async (id) => {
  const res = await api(`/materiales/${id}`);
  const payload = extract(res);

  return toUI(payload);
};

export const createMaterial = async (material) => {
  const body = {
    nombre_material: material.nombre_material,
    categoria_id: material.categoria_id ? Number(material.categoria_id) : null,
    descripcion: material.descripcion ?? null,
    unidad_de_medida: material.unidad_de_medida,
    cantidad_en_stock: Number(material.cantidad_en_stock ?? 0),
    stock_minimo: Number(material.stock_minimo ?? 10),
    precio_unitario: Number(material.precio_unitario ?? 0),
  };

  const res = await api("/materiales", {
    method: "POST",
    body,
  });

  const payload = extract(res);

  return toUI(payload);
};

export const updateMaterial = async (id, material) => {
  const body = {
    nombre_material: material.nombre_material,
    categoria_id: material.categoria_id ? Number(material.categoria_id) : null,
    descripcion: material.descripcion ?? null,
    unidad_de_medida: material.unidad_de_medida,
    cantidad_en_stock: Number(material.cantidad_en_stock ?? 0),
    stock_minimo: Number(material.stock_minimo ?? 10),
    precio_unitario: Number(material.precio_unitario ?? 0),
  };

  const res = await api(`/materiales/${id}`, {
    method: "PATCH",
    body,
  });

  const payload = extract(res);

  return toUI(payload);
};

export const deleteMaterial = async (id) => {
  await api(`/materiales/${id}`, {
    method: "DELETE",
  });

  return true;
};