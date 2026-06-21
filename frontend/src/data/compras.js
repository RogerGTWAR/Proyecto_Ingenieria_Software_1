import { api } from "./api.js";

const extractPayload = (res) => {
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
};

const toUI = (c) => ({
  id: c.compra_id ?? c.id,

  proveedor_id: c.proveedor_id ?? null,
  proveedorNombre:
    c.proveedorNombre ??
    c.proveedores?.nombre_empresa ??
    "—",

  empleado_id: c.empleado_id ?? null,
  empleadoNombre:
    c.empleadoNombre ??
    (c.empleados
      ? `${c.empleados.nombres} ${c.empleados.apellidos}`
      : "—"),

  numero_factura: c.numero_factura ?? "",
  fecha_compra: c.fecha_compra ? c.fecha_compra.split("T")[0] : "",
  monto_total: Number(c.monto_total ?? 0),
  estado: c.estado ?? "Pendiente",
  observaciones: c.observaciones ?? "",
});

const toApi = (c) => ({
  proveedor_id: Number(c.proveedor_id),
  empleado_id: c.empleado_id ? Number(c.empleado_id) : null,
  numero_factura: c.numero_factura?.trim(),
  fecha_compra: c.fecha_compra || new Date().toISOString().split("T")[0],
  monto_total: Number(c.monto_total ?? 0),
  estado: c.estado ?? "Pendiente",
  observaciones: c.observaciones?.trim() || null,
});

export const fetchCompras = async () => {
  const res = await api("/compras");

  const payload = extractPayload(res);
  const list = Array.isArray(payload) ? payload : [];

  return list.map(toUI);
};

export const createCompra = async (compra) => {
  const res = await api("/compras", {
    method: "POST",
    body: toApi(compra),
  });

  const payload = extractPayload(res);

  return toUI(payload);
};

export const updateCompra = async (id, compra) => {
  const res = await api(`/compras/${id}`, {
    method: "PATCH",
    body: toApi(compra),
  });

  const payload = extractPayload(res);

  return toUI(payload);
};

export const deleteCompra = async (id) => {
  await api(`/compras/${id}`, {
    method: "DELETE",
  });

  return true;
};