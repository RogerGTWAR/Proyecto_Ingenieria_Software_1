import React from "react";
import { useProyectos } from "../../hooks/useProyectos";

export default function AvaluosCard({ avaluos, onEdit, onDelete, onVerDetalles }) {
  const { items: proyectos } = useProyectos();

  if (!avaluos?.length) {
    return (
      <p className="text-gray-500 text-center mt-4 text-base">
        No hay avalúos registrados.
      </p>
    );
  }

  const proyectosMap = Object.fromEntries(
    proyectos.map((p) => [Number(p.id), p])
  );

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {avaluos.map((a) => {
        const proyecto = proyectosMap[Number(a.proyectoId)];

        return (
          <div
            key={a.id}
            className="bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-md 
                       p-5 w-[310px] hover:shadow-lg hover:scale-[1.02] 
                       transition-all duration-200"
          >
            {/* TITULO */}
            <h3 className="font-semibold text-[var(--color-primary)] text-[17px] mb-2 text-center">
              {a.descripcion?.trim() || `Avalúo #${a.id}`}
            </h3>

            {/* INFO */}
            <div className="text-[15px] text-gray-700 space-y-1 mb-3">
              <p>
                <strong>Proyecto:</strong>{" "}
                {proyecto?.nombreProyecto || `Proyecto ${a.proyectoId}`}
              </p>

              <p>
              <strong>Monto Ejecutado:</strong>{" "}
                <span className="text-green-700 font-bold">
                  C${a.montoEjecutado.toLocaleString("es-NI")}
                </span>
              </p>

              <p><strong>Inicio:</strong> {a.fechaInicio || "—"}</p>
              <p><strong>Fin:</strong> {a.fechaFin || "—"}</p>
              <p><strong>Días:</strong> {a.tiempoTotalDias || 0}</p>
            </div>

            {/* BOTONES */}
            <div className="flex justify-center gap-2 mt-3">
              <button
                onClick={() => onVerDetalles(a)}
                className="text-white text-sm px-4 py-1.5 rounded-md hover:scale-105 transition"
                style={{ backgroundColor: "#1A2E81" }}
              >
                Detalles
              </button>

              <button
                onClick={() => onEdit(a)}
                className="bg-white border border-gray-300 text-gray-800 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100 hover:scale-105 transition"
              >
                Editar
              </button>

              <button
                onClick={() => onDelete(a)}
                className="bg-red-500 text-white text-sm px-4 py-1.5 rounded-md hover:bg-red-600 hover:scale-105 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
