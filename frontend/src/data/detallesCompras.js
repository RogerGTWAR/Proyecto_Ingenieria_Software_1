import { api } from "./api.js";

const toUI = (d) => {
  const precioMaterial =
    d.materiales?.precio_unitario !== undefined
      ? Number(d.materiales.precio_unitario)
      : Number(d.precio_unitario);

  return {
    id: d.detalle_compra_id,
    compraId: d.compra_id,
    materialId: d.material_id,

    materialNombre: d.materiales?.nombre_material ?? "Material desconocido",
    unidadDeMedida: d.materiales?.unidad_de_medida ?? "",

    cantidad: Number(d.cantidad),
    precio_unitario: precioMaterial,
    subtotal: Number(d.cantidad) * precioMaterial,
  };
};

export const fetchDetallesCompras = async () => {
  const { data } = await api("/detalle_compras");
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toUI);
};

export const createDetalleCompra = async (d) => {
  const body = {
    compra_id: Number(d.compra_id ?? d.compraId),
    material_id: Number(d.material_id ?? d.materialId),
    cantidad: Number(d.cantidad),
    precio_unitario: Number(d.precio_unitario),
  };

  const res = await api("/detalle_compras", { method: "POST", body });
  return toUI(res.data || res);
};

export const updateDetalleCompra = async (id, d) => {
  const body = {};

  if (d.cantidad !== undefined) body.cantidad = Number(d.cantidad);
  if (d.precio_unitario !== undefined)
    body.precio_unitario = Number(d.precio_unitario);

  const res = await api(`/detalle_compras/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(res.data || res);
};

export const deleteDetalleCompra = async (id) => {
  await api(`/detalle_compras/${id}`, { method: "DELETE" });
  return true;
};
