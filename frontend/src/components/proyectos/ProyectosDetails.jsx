import React, { useEffect, useMemo } from "react";
import { useDetallesEmpleados } from "../../hooks/useDetallesEmpleados";
import { useEmpleados } from "../../hooks/useEmpleados";

const ProyectosDetails = ({ proyecto, onClose, onEdit, onDelete }) => {
  const { items: detalles, reload: reloadDetalles } = useDetallesEmpleados();
  const { items: empleados, reload: reloadEmpleados } = useEmpleados();

  useEffect(() => {
    const load = async () => {
      await reloadDetalles();
      await reloadEmpleados();
    };
    load();
  }, [proyecto]);

  const tiempoTotalDias = useMemo(() => {
    if (!proyecto?.fechaInicio || !proyecto?.fechaFin) return "—";
    try {
      const inicio = new Date(proyecto.fechaInicio);
      const fin = new Date(proyecto.fechaFin);
      const diffMs = fin - inicio;
      if (isNaN(diffMs) || diffMs < 0) return "—";
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return `${diffDays} días`;
    } catch {
      return "—";
    }
  }, [proyecto?.fechaInicio, proyecto?.fechaFin]);

  const empleadosAsignados = useMemo(() => {
    if (!proyecto?.id) return [];
    const detallesProyecto = detalles.filter(
      (d) => Number(d.proyectoId) === Number(proyecto.id)
    );

    return detallesProyecto
      .map((d) => {
        const emp = empleados.find((e) => Number(e.id) === Number(d.empleadoId));
        if (!emp) return null;
        return {
          id: emp.id,
          nombreCompleto: `${emp.nombres} ${emp.apellidos}`,
          rol: emp.rolNombre ?? "Sin rol",
          fechaAsignacion: d.fechaProyecto,
        };
      })
      .filter(Boolean);
  }, [detalles, empleados, proyecto]);

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      {/* 🏗️ Caja del modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4 text-center">
          {proyecto.nombreProyecto}
        </h2>

        {/* 📋 Datos generales */}
        <div className="space-y-2 text-gray-700">
          <p><strong>Cliente:</strong> {proyecto.clienteNombre}</p>
          <p><strong>Ubicación:</strong> {proyecto.ubicacion || "—"}</p>
          <p><strong>Estado:</strong> {proyecto.estado}</p>
          <p>
            <strong>Presupuesto Total:</strong>{" "}
            C${proyecto.presupuestoTotal?.toLocaleString()}
          </p>
          <p><strong>Fecha Inicio:</strong> {proyecto.fechaInicio?.split("T")[0] || "—"}</p>
          <p><strong>Fecha Fin:</strong> {proyecto.fechaFin?.split("T")[0] || "—"}</p>
          <p><strong>Tiempo Total:</strong> {tiempoTotalDias}</p>
          <p><strong>Descripción:</strong> {proyecto.descripcion || "—"}</p>
        </div>

        {/* 👷 Empleados asignados */}
        <h3 className="text-lg font-semibold text-[var(--color-primary)] mt-6 mb-2">
          Empleados Asignados
        </h3>

        {empleadosAsignados.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {empleadosAsignados.map((e) => (
              <li key={e.id} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium text-gray-800">
                    {e.nombreCompleto}
                    <span className="text-sm text-gray-500 ml-1">({e.rol})</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {e.fechaAsignacion
                      ? new Date(e.fechaAsignacion).toLocaleDateString()
                      : "sin fecha"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">
            No hay empleados asignados a este proyecto.
          </p>
        )}

        {/* 🔘 Botones con estilo uniforme */}
        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => onEdit(proyecto)}
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(proyecto)}
            className="bg-red-600 text-white text-base font-medium px-7 py-3 rounded-md hover:bg-red-700 transition-all"
            style={{ minWidth: "130px" }}
          >
            Eliminar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 text-base font-medium px-7 py-3 rounded-md hover:bg-gray-400 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProyectosDetails;
