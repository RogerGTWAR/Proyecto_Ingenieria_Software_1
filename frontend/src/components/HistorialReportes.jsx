import { useEffect, useState } from "react";
import { reportesService } from "../services/reportesService";

export default function HistorialReportes() {
  const [lista, setLista] = useState([]);

  const cargar = async () => {
    const resp = await reportesService.listar();
    if (resp.ok) setLista(resp.data);
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar reporte?")) return;

    await reportesService.eliminar(id);
    cargar();
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="mt-6 p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-3">Historial de Reportes</h2>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Reporte</th>
            <th className="p-2 border">Usuario</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {lista.map(r => (
            <tr key={r.reporte_id} className="hover:bg-gray-50">
              <td className="p-2 border">{r.reporte_id}</td>
              <td className="p-2 border">{r.nombre_reporte}</td>
              <td className="p-2 border">{r.usuario?.usuario}</td>
              <td className="p-2 border">
                {new Date(r.fecha_creacion).toLocaleString()}
              </td>
              <td className="p-2 border space-x-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => reportesService.descargar(r.reporte_id)}
                >
                  Descargar
                </button>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => eliminar(r.reporte_id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
