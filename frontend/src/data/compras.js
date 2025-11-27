import { api } from "./api.js";

const toUI = (c) => ({
  id: c.compra_id,
  proveedor_id: c.proveedor_id,
  proveedorNombre: c.proveedores?.nombre_empresa ?? "—",
  empleado_id: c.empleado_id,
  empleadoNombre: c.empleados
    ? `${c.empleados.nombres} ${c.empleados.apellidos}`
    : "—",
  numero_factura: c.numero_factura,
  fecha_compra: c.fecha_compra ? c.fecha_compra.split("T")[0] : "",
  monto_total: Number(c.monto_total) ?? 0,
  estado: c.estado,
  observaciones: c.observaciones ?? "",
});

export const fetchCompras = async () => {
  const { data } = await api("/compras");
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toUI);
};

export const createCompra = async (c) => {
  const body = {
    proveedor_id: Number(c.proveedor_id),
    empleado_id: Number(c.empleado_id) || null,
    numero_factura: c.numero_factura?.trim(),
    fecha_compra: c.fecha_compra || new Date().toISOString().split("T")[0],
    monto_total: Number(c.monto_total) || 0,
    estado: c.estado,
    observaciones: c.observaciones || null,
  };

  const resp = await api("/compras", {
    method: "POST",
    body,
  });

  return toUI(resp.data || resp);
};

export const updateCompra = async (id, c) => {
  const body = {
    proveedor_id: Number(c.proveedor_id),
    empleado_id: Number(c.empleado_id) || null,
    numero_factura: c.numero_factura?.trim(),
    fecha_compra: c.fecha_compra,
    monto_total: Number(c.monto_total),
    estado: c.estado,
    observaciones: c.observaciones || null,
  };

  const resp = await api(`/compras/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(resp.data || resp);
};

export const deleteCompra = async (id) => {
  await api(`/compras/${id}`, { method: "DELETE" });
  return true;
};
