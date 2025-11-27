import { api } from "./api.js";

const toUI = (m) => ({
  id: m.material_id, 
  categoria_id: m.categoria_id ?? null,
  categoriaNombre: m.categorias?.nombre_categoria ?? "Sin categoría",
  nombre_material: m.nombre_material ?? m.nombre_producto ?? "",
  descripcion: m.descripcion ?? "",
  unidad_de_medida: m.unidad_de_medida ?? "",
  cantidad_en_stock: m.cantidad_en_stock ?? 0,
  precio_unitario: m.precio_unitario ?? 0,
});

export const fetchMateriales = async () => {
  const { data } = await api("/materiales");
  return (data ?? []).map(toUI);
};

export const createMaterial = async (m) => {
  const body = {
    nombre_material: m.nombre_material,
    categoria_id: m.categoria_id ? Number(m.categoria_id) : null,
    descripcion: m.descripcion ?? null,
    unidad_de_medida: m.unidad_de_medida,
    cantidad_en_stock: Number(m.cantidad_en_stock ?? 0),
    precio_unitario: Number(m.precio_unitario ?? 0),
  };

  const { data } = await api("/materiales", {
    method: "POST",
    body,
  });

  return toUI(data);
};

export const updateMaterial = async (id, m) => {
  const body = {
    ...(m.nombre_material && { nombre_material: m.nombre_material }),
    ...(m.categoria_id && { categoria_id: Number(m.categoria_id) }),
    ...(m.descripcion && { descripcion: m.descripcion }),
    ...(m.unidad_de_medida && { unidad_de_medida: m.unidad_de_medida }),
    ...(m.cantidad_en_stock && { cantidad_en_stock: Number(m.cantidad_en_stock) }),
    ...(m.precio_unitario && { precio_unitario: Number(m.precio_unitario) }),
  };

  const { data } = await api(`/materiales/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(data);
};

export const deleteMaterial = async (id) => {
  await api(`/materiales/${id}`, { method: "DELETE" });
  return true;
};
