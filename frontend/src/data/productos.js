import { api } from "./api.js";

const toUI = (p) => ({
  id: p.producto_id,
  categoria_id: p.categoria_id ?? null,
  categoriaNombre: p.categorias?.nombre_categoria ?? "Sin categoría",
  nombre_producto: p.nombre_producto ?? "",
  descripcion: p.descripcion ?? "",
  unidad_de_medida: p.unidad_de_medida ?? "",
  cantidad_en_stock: p.cantidad_en_stock ?? 0,
  precio_unitario: p.precio_unitario ?? 0,
});

export const fetchProductos = async () => {
  const { data } = await api("/productos");
  return (data ?? []).map(toUI);
};

export const createProducto = async (p) => {
  const body = {
    nombre_producto: p.nombre_producto,
    categoria_id: p.categoria_id ? Number(p.categoria_id) : null,
    descripcion: p.descripcion ?? null,
    unidad_de_medida: p.unidad_de_medida,
    cantidad_en_stock: Number(p.cantidad_en_stock ?? 0),
    precio_unitario: Number(p.precio_unitario ?? 0),
  };

  const { data } = await api("/productos", {
    method: "POST",
    body,
  });

  return toUI(data);
};

export const updateProducto = async (id, p) => {
  const body = {
    ...(p.nombre_producto && { nombre_producto: p.nombre_producto }),
    ...(p.categoria_id && { categoria_id: Number(p.categoria_id) }),
    ...(p.descripcion && { descripcion: p.descripcion }),
    ...(p.unidad_de_medida && { unidad_de_medida: p.unidad_de_medida }),
    ...(p.cantidad_en_stock && { cantidad_en_stock: Number(p.cantidad_en_stock) }),
    ...(p.precio_unitario && { precio_unitario: Number(p.precio_unitario) }),
  };

  const { data } = await api(`/productos/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(data);
};

export const deleteProducto = async (id) => {
  await api(`/productos/${id}`, { method: "DELETE" });
  return true;
};
