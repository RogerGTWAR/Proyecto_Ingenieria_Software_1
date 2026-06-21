import { api } from "./api.js";

const toUI = (c) => ({
  id: c.cliente_id,
  tipoCliente: c.tipo_cliente ?? "",
  numeroIdentificacion: c.numero_identificacion ?? "",
  nombreEmpresa: c.nombre_empresa ?? "",
  nombreContacto: c.nombre_contacto ?? "",
  cargoContacto: c.cargo_contacto ?? "",
  direccion: c.direccion ?? "",
  ciudad: c.ciudad ?? "",
  pais: c.pais ?? "",
  telefono: c.telefono ?? "",
  correo: c.correo ?? "",
});

const extractPayload = (res) => {
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
};

export const fetchClientes = async () => {
  const res = await api("/clientes");

  const data = extractPayload(res);
  const list = Array.isArray(data) ? data : [];

  return list.map(toUI);
};

export const createCliente = async (cliente) => {
  const body = {
    cliente_id: String(cliente.id ?? "").trim(),
    tipo_cliente: cliente.tipoCliente,
    numero_identificacion: cliente.numeroIdentificacion,
    nombre_empresa: cliente.nombreEmpresa,
    nombre_contacto: cliente.nombreContacto,
    cargo_contacto: cliente.cargoContacto,
    direccion: cliente.direccion,
    ciudad: cliente.ciudad,
    pais: cliente.pais,
    telefono: cliente.telefono,
    correo: cliente.correo,
  };

  const res = await api("/clientes", {
    method: "POST",
    body,
  });

  const payload = extractPayload(res);
  return toUI(payload);
};

export const updateCliente = async (id, cliente) => {
  const body = {
    tipo_cliente: cliente.tipoCliente,
    numero_identificacion: cliente.numeroIdentificacion,
    nombre_empresa: cliente.nombreEmpresa,
    nombre_contacto: cliente.nombreContacto,
    cargo_contacto: cliente.cargoContacto,
    direccion: cliente.direccion,
    ciudad: cliente.ciudad,
    pais: cliente.pais,
    telefono: cliente.telefono,
    correo: cliente.correo,
  };

  const res = await api(`/clientes/${id}`, {
    method: "PATCH",
    body,
  });

  const payload = extractPayload(res);
  return toUI(payload);
};

export const deleteCliente = async (id) => {
  await api(`/clientes/${id}`, {
    method: "DELETE",
  });

  return true;
};