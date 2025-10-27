import { api } from "./api.js";

const toUI = (c) => ({
  id: c.cliente_id,
  nombreEmpresa: c.nombre_empresa ?? "",
  nombreContacto: c.nombre_contacto ?? "",
  cargoContacto: c.cargo_contacto ?? "",
  direccion: c.direccion ?? "",
  ciudad: c.ciudad ?? "",
  pais: c.pais ?? "",
  telefono: c.telefono ?? "",
});

export const fetchClientes = async () => {
  const { data } = await api("/clientes");
  const list = Array.isArray(data) ? data : data?.data || [];
  return list.map(toUI);
};

export const createCliente = async (u) => {
  const body = {
    cliente_id: String(u.id).trim(),       
    nombre_empresa: u.nombreEmpresa,
    nombre_contacto: u.nombreContacto,
    cargo_contacto: u.cargoContacto,
    direccion: u.direccion,
    ciudad: u.ciudad,
    pais: u.pais,
    telefono: u.telefono,
  };

  const { data } = await api("/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" }, 
    body,
  });

  const payload = data?.data || data; 
  return toUI(payload);
};

export const updateCliente = async (id, u) => {
  const body = {
    nombre_empresa: u.nombreEmpresa,
    nombre_contacto: u.nombreContacto,
    cargo_contacto: u.cargoContacto,
    direccion: u.direccion,
    ciudad: u.ciudad,
    pais: u.pais,
    telefono: u.telefono,
  };

  const { data } = await api(`/clientes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const payload = data?.data || data;
  return toUI(payload);
};

export const deleteCliente = async (id) => {
  await api(`/clientes/${id}`, { method: "DELETE" });
  return true;
};
