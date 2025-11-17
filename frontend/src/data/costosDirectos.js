import { api } from "./api.js";

// Convertir backend → UI
const toUI = (d) => ({
  id: d.costo_directo_id,

  servicioId: d.servicio_id ?? 0,
  materialId: d.material_id ?? 0,

  servicioNombre: d.servicio_id_servicios?.nombre_servicio ?? "",
  materialNombre: d.material_id_materiales?.nombre_material ?? "",

  cantidadMaterial: Number(d.cantidad_material ?? 0),
  unidadMedida: d.unidad_de_medida ?? "",
  precioUnitario: Number(d.precio_unitario ?? 0),

  costoMaterial: Number(d.costo_material ?? 0),
  manoObra: Number(d.mano_obra ?? 0),
  equiposTransporteHerramientas: Number(d.equipos_transporte_herramientas ?? 0),
  totalCostoDirecto: Number(d.total_costo_directo ?? 0),

  fechaCreacion: d.fecha_creacion ?? "",
  fechaActualizacion: d.fecha_actualizacion ?? "",
});

// GET
export const fetchCostosDirectos = async () => {
  const { data } = await api("/costos_directos");
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toUI);
};

// POST
export const createCostoDirecto = async (d) => {
  const body = {
    servicio_id: Number(d.servicio_id ?? d.servicioId),
    material_id: Number(d.material_id ?? d.materialId),
    cantidad_material: Number(d.cantidad_material ?? d.cantidadMaterial ?? 0),
    unidad_de_medida: d.unidad_de_medida ?? d.unidadMedida ?? "",
    precio_unitario: Number(d.precio_unitario ?? d.precioUnitario ?? 0),
  };

  const response = await api("/costos_directos", {
    method: "POST",
    body,
  });

  return toUI(response.data || response);
};

// PATCH
export const updateCostoDirecto = async (id, d) => {
  const body = {
    servicio_id: d.servicioId ? Number(d.servicioId) : undefined,
    material_id: d.materialId ? Number(d.materialId) : undefined,
    cantidad_material:
      d.cantidadMaterial !== undefined
        ? Number(d.cantidadMaterial)
        : undefined,
    unidad_de_medida: d.unidadMedida ?? undefined,
    precio_unitario:
      d.precioUnitario !== undefined ? Number(d.precioUnitario) : undefined,
  };

  const response = await api(`/costos_directos/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(response.data || response);
};

// DELETE
export const deleteCostoDirecto = async (id) => {
  await api(`/costos_directos/${id}`, { method: "DELETE" });
  return true;
};
