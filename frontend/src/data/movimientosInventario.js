import { api } from "./api.js";

const extractList = (res) => {
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
};

const extractItem = (res) => {
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
};

const toUI = (m) => ({
  id: m.movimiento_id ?? m.id,
  material_id: m.material_id ?? m.materialId ?? null,

  materialNombre:
    m.materialNombre ??
    m.materiales?.nombre_material ??
    "Sin material",

  unidadMedida:
    m.unidadMedida ??
    m.materiales?.unidad_de_medida ??
    "",

  tipoMovimiento: m.tipo_movimiento ?? m.tipoMovimiento ?? "",
  cantidad: Number(m.cantidad ?? 0),
  stockAnterior: Number(m.stock_anterior ?? m.stockAnterior ?? 0),
  stockNuevo: Number(m.stock_nuevo ?? m.stockNuevo ?? 0),

  precioUnitario: Number(m.precio_unitario ?? m.precioUnitario ?? 0),
  costoTotal: Number(m.costo_total ?? m.costoTotal ?? 0),

  referencia: m.referencia ?? "",
  descripcion: m.descripcion ?? "",

  usuario_id: m.usuario_id ?? m.usuarioId ?? null,
  usuarioNombre: m.usuarioNombre ?? m.usuarios?.usuario ?? "",

  empleadoNombre:
    m.empleadoNombre ??
    (m.usuarios?.empleados
      ? `${m.usuarios.empleados.nombres ?? ""} ${
          m.usuarios.empleados.apellidos ?? ""
        }`.trim()
      : ""),

  fechaMovimiento: m.fecha_movimiento ?? m.fechaMovimiento ?? "",
});

export const fetchMovimientosInventario = async () => {
  const res = await api("/movimientos_inventario");

  const list = extractList(res);

  return list.map(toUI);
};

export const fetchMovimientoInventarioById = async (id) => {
  const res = await api(`/movimientos_inventario/${id}`);

  const payload = extractItem(res);

  return toUI(payload);
};

export const fetchMovimientosPorMaterial = async (materialId) => {
  const res = await api(`/movimientos_inventario/material/${materialId}`);

  const list = extractList(res);

  return list.map(toUI);
};

export const registrarEntradaInventario = async (payload) => {
  const body = {
    material_id: Number(payload.material_id),
    cantidad: Number(payload.cantidad),
    precio_unitario: Number(payload.precio_unitario),
    referencia: payload.referencia?.trim() || "Entrada de inventario",
    descripcion:
      payload.descripcion?.trim() || "Entrada registrada desde el sistema",
    usuario_id: payload.usuario_id ? Number(payload.usuario_id) : null,
  };

  const res = await api("/movimientos_inventario/entrada", {
    method: "POST",
    body,
  });

  return extractItem(res);
};

export const registrarSalidaInventario = async (payload) => {
  const body = {
    material_id: Number(payload.material_id),
    cantidad: Number(payload.cantidad),
    referencia: payload.referencia?.trim() || "Salida de inventario",
    descripcion:
      payload.descripcion?.trim() || "Salida registrada desde el sistema",
    usuario_id: payload.usuario_id ? Number(payload.usuario_id) : null,
  };

  const res = await api("/movimientos_inventario/salida", {
    method: "POST",
    body,
  });

  return extractItem(res);
};

export const registrarAjusteInventario = async (payload) => {
  const body = {
    material_id: Number(payload.material_id),
    stock_nuevo: Number(payload.stock_nuevo),
    referencia: payload.referencia?.trim() || "Ajuste de inventario",
    descripcion:
      payload.descripcion?.trim() || "Ajuste registrado desde el sistema",
    usuario_id: payload.usuario_id ? Number(payload.usuario_id) : null,
  };

  const res = await api("/movimientos_inventario/ajuste", {
    method: "POST",
    body,
  });

  return extractItem(res);
};

export const deleteMovimientoInventario = async (id) => {
  await api(`/movimientos_inventario/${id}`, {
    method: "DELETE",
  });

  return true;
};