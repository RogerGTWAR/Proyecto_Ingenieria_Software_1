import { api } from "./api.js";

const toUI = (p) => ({
  id: p.proveedor_id,
  categoria_proveedor_id: p.categoria_proveedor_id ?? null,
  categoriaNombre: p.categoria ?? p.categorias_proveedor?.nombre_categoria ?? "Sin categoría",
  nombre_empresa: p.nombre_empresa ?? "",
  nombre_contacto: p.nombre_contacto ?? "",
  cargo_contacto: p.cargo_contacto ?? "",
  direccion: p.direccion ?? "",
  ciudad: p.ciudad ?? "",
  pais: p.pais ?? "",
  telefono: p.telefono ?? "",
  correo: p.correo ?? "",
});

export const fetchProveedores = async () => {
  const { data } = await api("/proveedores");
  return (data ?? []).map(toUI);
};

export const createProveedor = async (p) => {
  const body = {
    categoria_proveedor_id: Number(p.categoria_proveedor_id ?? p.categoriaId),
    nombre_empresa: p.nombre_empresa ?? p.nombreEmpresa,
    nombre_contacto: p.nombre_contacto ?? p.nombreContacto ?? null,
    cargo_contacto: p.cargo_contacto ?? p.cargoContacto ?? null,
    direccion: p.direccion ?? null,
    ciudad: p.ciudad ?? null,
    pais: p.pais ?? null,
    telefono: p.telefono ?? null,
    correo: p.correo ?? null,
  };

  const { data } = await api("/proveedores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return toUI(data);
};

export const updateProveedor = async (id, p) => {
  const body = {
    ...(p.categoria_proveedor_id ?? p.categoriaId
      ? { categoria_proveedor_id: Number(p.categoria_proveedor_id ?? p.categoriaId) }
      : {}),
    ...(p.nombre_empresa && { nombre_empresa: p.nombre_empresa }),
    ...(p.nombre_contacto && { nombre_contacto: p.nombre_contacto }),
    ...(p.cargo_contacto && { cargo_contacto: p.cargo_contacto }),
    ...(p.direccion && { direccion: p.direccion }),
    ...(p.ciudad && { ciudad: p.ciudad }),
    ...(p.pais && { pais: p.pais }),
    ...(p.telefono && { telefono: p.telefono }),
    ...(p.correo && { correo: p.correo }),
  };

  const { data } = await api(`/proveedores/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return toUI(data);
};

export const deleteProveedor = async (id) => {
  await api(`/proveedores/${id}`, { method: "DELETE" });
  return true;
};
