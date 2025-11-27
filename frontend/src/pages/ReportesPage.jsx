//Falta
import { useEffect, useState } from "react";
import UploadReporte from "../components/UploadReporte";
import HistorialReportes from "../components/HistorialReportes";
import { reportesService } from "../services/reportesService";

export default function ReportesPage() {
  const usuarioId = 1; // luego lo sacas del contexto de auth

  const [listaAvaluos, setListaAvaluos] = useState([]);
  const [avaluoSeleccionado, setAvaluoSeleccionado] = useState("");

  // Cargar avalúos para el combo
  useEffect(() => {
    const cargarAvaluos = async () => {
      const res = await fetch("http://localhost:3000/api/avaluos");
      const json = await res.json();
      if (json.ok) setListaAvaluos(json.data);
    };
    cargarAvaluos();
  }, []);

  const generarAvaluos = async () => {
    if (!avaluoSeleccionado) {
      alert("Seleccione un avalúo.");
      return;
    }

    const resp = await reportesService.generarAvaluos({
      usuario_id: usuarioId,
      avaluo_id: Number(avaluoSeleccionado),
    });

    if (resp.ok) {
      alert("PDF generado y guardado en el historial.");
    } else {
      alert(resp.msg || "Error al generar PDF.");
    }
  };

  const generarServicios = async () => {
    const resp = await reportesService.generarServicios(usuarioId);
    if (resp.ok) {
      alert("Excel generado y guardado en el historial.");
    } else {
      alert(resp.msg || "Error al generar Excel.");
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Fila para selección de avalúo + botones */}
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Avalúo para generar PDF:
          </label>
          <select
            className="border p-2 rounded min-w-[260px]"
            value={avaluoSeleccionado}
            onChange={(e) => setAvaluoSeleccionado(e.target.value)}
          >
            <option value="">-- Seleccione un avalúo --</option>
            {listaAvaluos.map((a) => (
              <option key={a.avaluo_id} value={a.avaluo_id}>
                {a.avaluo_id} - {a.proyectos?.nombre_proyecto}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={generarAvaluos}
          className="bg-purple-600 text-white px-4 py-2 rounded h-10 mt-5"
        >
          Generar PDF de Avalúo
        </button>

        <button
          onClick={generarServicios}
          className="bg-orange-600 text-white px-4 py-2 rounded h-10 mt-5"
        >
          Generar Excel de Servicios
        </button>
      </div>

      {/* Subir archivo manualmente */}
      <UploadReporte usuarioId={usuarioId} />

      {/* Historial */}
      <HistorialReportes />
    </div>
  );
}
