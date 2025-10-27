import { api } from "./api.js";

const toUI = (c) => ({
  id: c.categoria_proveedor_id,
  nombre_categoria: c.nombre_categoria ?? "",
  descripcion: c.descripcion ?? "",
});

export const fetchCategoriasProveedor = async () => {
  const { data } = await api("/categorias_proveedores");
  return (data ?? []).map(toUI);
};

export const createCategoriaProveedor = async (c) => {
  const body = {
    nombre_categoria: c.nombre_categoria ?? c.nombreCategoria,
    descripcion: c.descripcion ?? null,
  };

  const { data } = await api("/categorias_proveedores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return toUI(data);
};

export const updateCategoriaProveedor = async (id, c) => {
  const body = {
    ...(c.nombre_categoria && { nombre_categoria: c.nombre_categoria }),
    ...(c.descripcion && { descripcion: c.descripcion }),
  };

  const { data } = await api(`/categorias_proveedores/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return toUI(data);
};

export const deleteCategoriaProveedor = async (id) => {
  await api(`/categorias_proveedores/${id}`, { method: "DELETE" });
  return true;
};
