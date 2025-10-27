import { api } from "./api.js";

const toUI = (c) => ({
  id: c.categoria_id,
  nombre_categoria: c.nombre_categoria ?? "",
  descripcion: c.descripcion ?? "",
});

export const fetchCategorias = async () => {
  const { data } = await api("/categorias");
  return (data ?? []).map(toUI);
};

export const createCategoria = async (c) => {
  const body = {
    nombre_categoria: c.nombre_categoria ?? "",
    descripcion: c.descripcion ?? "",
  };

  const { data } = await api("/categorias", {
    method: "POST",
    body,
  });

  return toUI(data);
};

export const updateCategoria = async (id, c) => {
  const body = {
    ...(c.nombre_categoria && { nombre_categoria: c.nombre_categoria }),
    ...(c.descripcion && { descripcion: c.descripcion }),
  };

  const { data } = await api(`/categorias/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(data);
};

export const deleteCategoria = async (id) => {
  await api(`/categorias/${id}`, { method: "DELETE" });
  return true;
};
