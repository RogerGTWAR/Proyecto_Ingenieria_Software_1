import { api } from "./api.js";

const toUI = (p) => ({
  id: p.proveedor_id,
  categoria_proveedor_id: p.categoria_proveedor_id ?? null,
  categoriaNombre:
    p.categoria ?? p.categorias_proveedor?.nombre_categoria ?? "Sin categoría",
  nombre_empresa: p.nombre_empresa ?? "",
  nombre_contacto: p.nombre_contacto ?? "",
  cargo_contacto: p.cargo_contacto ?? "",
  direccion: p.direccion ?? "",
  ciudad: p.ciudad ?? "",
  pais: p.pais ?? "",
  telefono: p.telefono ?? "",
  correo: p.correo ?? "",
});

const extractPayload = (res) => {
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
};

export const fetchProveedores = async () => {
  const res = await api("/proveedores");

  const data = extractPayload(res);
  const list = Array.isArray(data) ? data : [];

  return list.map(toUI);
};

export const createProveedor = async (proveedor) => {
  const body = {
    categoria_proveedor_id: Number(
      proveedor.categoria_proveedor_id ?? proveedor.categoriaId
    ),
    nombre_empresa: proveedor.nombre_empresa ?? proveedor.nombreEmpresa,
    nombre_contacto:
      proveedor.nombre_contacto ?? proveedor.nombreContacto ?? null,
    cargo_contacto:
      proveedor.cargo_contacto ?? proveedor.cargoContacto ?? null,
    direccion: proveedor.direccion ?? null,
    ciudad: proveedor.ciudad ?? null,
    pais: proveedor.pais ?? null,
    telefono: proveedor.telefono ?? null,
    correo: proveedor.correo ?? null,
  };

  const res = await api("/proveedores", {
    method: "POST",
    body,
  });

  const payload = extractPayload(res);
  return toUI(payload);
};

export const updateProveedor = async (id, proveedor) => {
  const body = {
    categoria_proveedor_id: Number(
      proveedor.categoria_proveedor_id ?? proveedor.categoriaId
    ),
    nombre_empresa: proveedor.nombre_empresa ?? proveedor.nombreEmpresa,
    nombre_contacto:
      proveedor.nombre_contacto ?? proveedor.nombreContacto ?? null,
    cargo_contacto:
      proveedor.cargo_contacto ?? proveedor.cargoContacto ?? null,
    direccion: proveedor.direccion ?? null,
    ciudad: proveedor.ciudad ?? null,
    pais: proveedor.pais ?? null,
    telefono: proveedor.telefono ?? null,
    correo: proveedor.correo ?? null,
  };

  const res = await api(`/proveedores/${id}`, {
    method: "PATCH",
    body,
  });

  const payload = extractPayload(res);
  return toUI(payload);
};

export const deleteProveedor = async (id) => {
  await api(`/proveedores/${id}`, {
    method: "DELETE",
  });

  return true;
};