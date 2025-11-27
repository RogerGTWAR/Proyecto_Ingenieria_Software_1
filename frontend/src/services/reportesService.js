//Falta
const API_URL = "http://localhost:3000/api/reportes";

export const reportesService = {
  async listar() {
    const res = await fetch(API_URL);
    return res.json();
  },

  async crear(formData) {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    return res.json();
  },

  async descargar(id) {
    const res = await fetch(`${API_URL}/descargar/${id}`);
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_${id}`;
    a.click();
  },

  async eliminar(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // 🔹 Generar PDF de un avalúo específico
  async generarAvaluos({ usuario_id, avaluo_id }) {
    const res = await fetch(`${API_URL}/generar/avaluos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id, avaluo_id }),
    });
    return res.json();
  },

  // 🔹 Generar Excel de servicios (igual que ya tenías)
  async generarServicios(usuario_id) {
    const res = await fetch(`${API_URL}/generar/servicios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id }),
    });
    return res.json();
  },
};
