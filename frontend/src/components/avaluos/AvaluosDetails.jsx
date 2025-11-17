import React, { useEffect } from "react";
import { useDetallesAvaluos } from "../../hooks/useDetallesAvaluos";
import { useServicios } from "../../hooks/useServicios";
import { useProyectos } from "../../hooks/useProyectos";

export default function AvaluosDetails({ avaluo, onClose, onEdit, onDelete }) {
  const { items: detalles, reload: reloadDetalles } = useDetallesAvaluos();
  const { items: servicios, reload: reloadServicios } = useServicios();
  const { items: proyectos, reload: reloadProyectos } = useProyectos();

  useEffect(() => {
    reloadDetalles();
    reloadServicios();
    reloadProyectos();
  }, [avaluo]);

  if (!avaluo) return null;

  const proyecto = proyectos.find(
    (p) => Number(p.id) === Number(avaluo.proyectoId)
  );

  // Filtrar detalles del avaluo
  const detallesAvaluo = detalles.filter(
    (d) => Number(d.avaluoId) === Number(avaluo.id)
  );

  // Acceso directo a servicios
  const serviciosMap = Object.fromEntries(
    servicios.map((s) => [Number(s.id), s])
  );

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <div className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">

        {/* TITULO */}
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4 text-center">
          {avaluo.descripcion?.trim() || `Avalúo #${avaluo.id}`}
        </h2>

        {/* DATOS GENERALES */}
        <div className="space-y-2 text-gray-700 mb-6">
          <p>
            <strong>Proyecto:</strong>{" "}
            {proyecto?.nombreProyecto || `Proyecto ${avaluo.proyectoId}`}
          </p>

          <p><strong>Descripción:</strong> {avaluo.descripcion || "—"}</p>

          <p>
            <strong>Monto Ejecutado:</strong>{" "}
            <span className="text-green-700 font-bold">
              C${avaluo.montoEjecutado.toLocaleString("es-NI")}
            </span>
          </p>

          <p><strong>Fecha Inicio:</strong> {avaluo.fechaInicio}</p>
          <p><strong>Fecha Fin:</strong> {avaluo.fechaFin}</p>

          <p>
            <strong>Total de días:</strong>{" "}
            {avaluo.tiempoTotalDias || "—"}
          </p>
        </div>

        {/* DETALLES DEL AVALÚO */}
        <h3 className="text-lg font-semibold text-[var(--color-primary)] mt-6 mb-2">
          Servicios Asociados
        </h3>

        {detallesAvaluo.length > 0 ? (
          <div className="space-y-3">
            {detallesAvaluo.map((d) => {
              const serv = serviciosMap[d.servicioId];

              const nombreServicio =
                serv?.nombreServicio || d.servicioNombre || "Servicio no disponible";

              const descripcionServicio =
                serv?.descripcion || d.servicioDescripcion || "";

              return (
                <div
                  key={d.id}
                  className="border border-gray-300 rounded-xl bg-[#F9FAFB] p-4 shadow-sm hover:shadow-md transition"
                >
                  {/* Nombre del servicio */}
                  <h4 className="text-base font-semibold text-gray-800 mb-3">
                    {nombreServicio}
                  </h4>

                  {/* Datos */}
                  <div className="text-sm text-gray-700 space-y-1">

                    <p><strong>Actividad:</strong> {d.actividad}</p>
                    <p><strong>Unidad:</strong> {d.unidadMedida}</p>
                    <p><strong>Cantidad:</strong> {d.cantidad}</p>

                    <p>
                      <strong>P. Unitario:</strong>{" "}
                      C${d.precioUnitario.toLocaleString("es-NI")}
                    </p>

                    <p>
                      <strong>Costo Venta:</strong>{" "}
                      C${d.costoVenta.toLocaleString("es-NI")}
                    </p>

                    <p>
                      <strong>IVA:</strong>{" "}
                      C${d.iva.toLocaleString("es-NI")}
                    </p>

                    <p className="font-bold text-blue-700">
                      TOTAL: C${d.totalCostoVenta.toLocaleString("es-NI")}
                    </p>

                    {/* Descripción del servicio (opcional) */}
                    {descripcionServicio && (
                      <p className="text-gray-500 italic mt-2">
                        {descripcionServicio}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 italic">No hay servicios asignados.</p>
        )}

        {/* BOTONES */}
        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => onEdit(avaluo)}
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81" }}
          >
            Editar
          </button>

          <button
            onClick={() => onDelete(avaluo)}
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
