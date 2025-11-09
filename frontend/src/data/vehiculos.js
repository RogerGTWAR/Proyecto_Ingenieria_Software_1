import { api } from "./api.js";

// 🔹 Adaptar datos del backend al formato de la UI
const toUI = (v) => ({
  id: v.vehiculo_id,
  proveedor_id: v.proveedor_id,
  proveedorNombre: v.proveedores?.nombre_empresa ?? "—",
  marca: v.marca,
  modelo: v.modelo,
  anio: v.anio,
  placa: v.placa,
  tipo_de_vehiculo: v.tipo_de_vehiculo,
  tipo_de_combustible: v.tipo_de_combustible,
  estado: v.estado,
  fecha_registro: v.fecha_registro
    ? v.fecha_registro.split("T")[0]
    : "",
});

// 🔹 Obtener todos los vehículos
export const fetchVehiculos = async () => {
  const { data } = await api("/vehiculos");
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toUI);
};

// 🔹 Crear vehículo
export const createVehiculo = async (v) => {
  const body = {
    proveedor_id: Number(v.proveedor_id) || null,
    marca: v.marca?.trim(),
    modelo: v.modelo?.trim(),
    anio: Number(v.anio) || null,
    placa: v.placa?.trim(),
    tipo_de_vehiculo: v.tipo_de_vehiculo || null,
    tipo_de_combustible: v.tipo_de_combustible || null,
    estado: v.estado || "Disponible",
    fecha_registro:
      v.fecha_registro || new Date().toISOString().split("T")[0],
  };

  console.log("📤 POST /vehiculos:", body);

  const data = await api("/vehiculos", {
    method: "POST",
    body,
  });

  const payload = data.data || data;
  return toUI(payload);
};

// 🔹 Actualizar vehículo
export const updateVehiculo = async (id, v) => {
  const body = {
    proveedor_id: Number(v.proveedor_id) || null,
    marca: v.marca?.trim(),
    modelo: v.modelo?.trim(),
    anio: Number(v.anio) || null,
    placa: v.placa?.trim(),
    tipo_de_vehiculo: v.tipo_de_vehiculo || null,
    tipo_de_combustible: v.tipo_de_combustible || null,
    estado: v.estado || null,
    fecha_registro:
      v.fecha_registro || new Date().toISOString().split("T")[0],
  };

  console.log("📤 PATCH /vehiculos:", body);

  const data = await api(`/vehiculos/${id}`, {
    method: "PATCH",
    body,
  });

  const payload = data.data || data;
  return toUI(payload);
};

// 🔹 Eliminar vehículo
export const deleteVehiculo = async (id) => {
  await api(`/vehiculos/${id}`, { method: "DELETE" });
  return true;
};
