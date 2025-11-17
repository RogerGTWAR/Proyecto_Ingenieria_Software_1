import React, { useEffect } from "react";
import { useCostosDirectos } from "../../hooks/useCostosDirectos";
import { useCostosIndirectos } from "../../hooks/useCostosIndirectos";

export default function ServiciosDetails({ servicio, onClose, onEdit, onDelete }) {
  const { items: directos, reload: reloadDirectos } = useCostosDirectos();
  const { items: indirectos, reload: reloadIndirectos } = useCostosIndirectos();

  useEffect(() => {
    reloadDirectos();
    reloadIndirectos();
  }, [servicio]);

  if (!servicio) return null;

  const directosServicio = directos.filter(
    (d) => Number(d.servicioId) === Number(servicio.id)
  );

  const indirectosServicio = indirectos.filter(
    (i) => Number(i.servicioId) === Number(servicio.id)
  );

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <div className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
        
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4 text-center">
          {servicio.nombreServicio}
        </h2>

        {/* Datos generales */}
        <div className="space-y-2 text-gray-700 mb-6">
          <p><strong>Descripción:</strong> {servicio.descripcion || "—"}</p>
          <p>
            <strong>Costo Directo Total:</strong>{" "}
            C${servicio.totalCostoDirecto.toLocaleString("es-NI")}
          </p>
          <p>
            <strong>Costo Indirecto Total:</strong>{" "}
            C${servicio.totalCostoIndirecto.toLocaleString("es-NI")}
          </p>
          <p>
            <strong>Costo de Venta:</strong>{" "}
            <span className="text-green-700 font-bold">
              C${servicio.costoVenta.toLocaleString("es-NI")}
            </span>
          </p>
        </div>

        {/* COSTOS DIRECTOS */}
        <h3 className="text-lg font-semibold text-[var(--color-primary)] mt-6 mb-2">
          Costos Directos
        </h3>

        {directosServicio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {directosServicio.map((d) => (
              <div
                key={d.id}
                className="rounded-xl border border-gray-300 bg-[#F9FAFB] p-4 shadow-sm hover:shadow-md transition"
              >
                <h4 className="text-base font-semibold text-gray-800 mb-3">
                  {d.materialNombre}
                </h4>

                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Cantidad:</strong> {d.cantidadMaterial} {d.unidadMedida}</p>
                  <p><strong>P. Unitario:</strong> C${d.precioUnitario.toLocaleString("es-NI")}</p>
                  <p><strong>C. Material:</strong> C${d.costoMaterial.toLocaleString("es-NI")}</p>
                  <p><strong>Mano de Obra:</strong> C${d.manoObra.toLocaleString("es-NI")}</p>
                  <p><strong>Equipos:</strong> C${d.equiposTransporteHerramientas.toLocaleString("es-NI")}</p>
                </div>

                <p className="font-bold">
                  TOTAL: 
                    C${d.totalCostoDirecto.toLocaleString("es-NI")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No hay costos directos.</p>
        )}

        {/* COSTOS INDIRECTOS */}
        <h3 className="text-lg font-semibold text-[var(--color-primary)] mt-6 mb-2">
          Costos Indirectos
        </h3>

        {indirectosServicio.length > 0 ? (
          <div className="space-y-3">
            {indirectosServicio.map((i) => (
              <div key={i.id} className="border border-gray-300 rounded-lg p-3 ">
                <p><strong>Costo Directo Base:</strong> C${i.totalCostoDirecto.toLocaleString("es-NI")}</p>
                <p><strong>Administración:</strong> C${i.administracion.toLocaleString("es-NI")}</p>
                <p><strong>Operación:</strong> C${i.operacion.toLocaleString("es-NI")}</p>
                <p><strong>Utilidad:</strong> C${i.utilidad.toLocaleString("es-NI")}</p>
                <p>
                  <strong>Total Indirecto:</strong>{" "}
                  <span className="font-bold">C${i.totalCostoIndirecto.toLocaleString("es-NI")}</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No hay costos indirectos.</p>
        )}

        {/* BOTONES */}
        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => onEdit(servicio)}
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81" }}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(servicio)}
            className="bg-red-600 text-white text-base font-medium px-7 py-3 rounded-md hover:bg-red-700"
          >
            Eliminar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 text-base font-medium px-7 py-3 rounded-md hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
