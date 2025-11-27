import React, { useEffect, useMemo } from "react";
import { useDetallesVehiculos } from "../../hooks/useDetallesVehiculos";
import { useEmpleados } from "../../hooks/useEmpleados";

const VehiculosDetails = ({ vehiculo, onClose, onEdit, onDelete }) => {
  const { items: detalles, reload: reloadDetalles } = useDetallesVehiculos();
  const { items: empleados, reload: reloadEmpleados } = useEmpleados();

  useEffect(() => {
    const load = async () => {
      await reloadDetalles();
      await reloadEmpleados();
    };
    load();
  }, [vehiculo]);

  const empleadosAsignados = useMemo(() => {
    if (!vehiculo?.id) return [];

    const detallesVehiculo = detalles.filter(
      (d) =>
        Number(d.vehiculoId ?? d.vehiculo_id) === Number(vehiculo.id)
    );

    return detallesVehiculo
      .map((d) => {
        const emp = empleados.find(
          (e) => Number(e.id) === Number(d.empleadoId ?? d.empleado_id)
        );
        if (!emp) return null;

        return {
          id: emp.id,
          nombreCompleto: `${emp.nombres} ${emp.apellidos}`,
          fechaInicio: d.fechaAsignacion ?? d.fecha_asignacion ?? null,
          fechaFin: d.fechaFinAsignacion ?? d.fecha_fin_asignacion ?? null,
          descripcion: d.descripcion || "",
        };
      })
      .filter(Boolean);
  }, [detalles, empleados, vehiculo]);

  const proveedorNombre =
    vehiculo.proveedorNombre ||
    vehiculo.proveedor ||
    vehiculo.proveedores?.nombre_empresa ||
    vehiculo.proveedores?.nombre_proveedor ||
    "—";

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <div className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4 text-center">
          {vehiculo.marca} {vehiculo.modelo}
        </h2>

        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Placa:</strong> {vehiculo.placa || "—"}
          </p>
          <p>
            <strong>Proveedor:</strong> {proveedorNombre}
          </p>
          <p>
            <strong>Año:</strong> {vehiculo.anio || "—"}
          </p>
          <p>
            <strong>Tipo de Vehículo:</strong>{" "}
            {vehiculo.tipo_de_vehiculo || vehiculo.tipoVehiculo || "—"}
          </p>
          <p>
            <strong>Combustible:</strong>{" "}
            {vehiculo.tipo_de_combustible || vehiculo.tipoCombustible || "—"}
          </p>
          <p>
            <strong>Estado:</strong> {vehiculo.estado || "—"}
          </p>
          <p>
            <strong>Fecha Registro:</strong>{" "}
            {vehiculo.fecha_registro
              ? new Date(vehiculo.fecha_registro).toLocaleDateString()
              : vehiculo.fechaRegistro || "—"}
          </p>
        </div>

        <h3 className="text-lg font-semibold text-[var(--color-primary)] mt-6 mb-2">
          Empleados Asignados
        </h3>

        {empleadosAsignados.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {empleadosAsignados.map((e) => (
              <li key={e.id} className="py-2">
                <p className="font-medium text-gray-800">
                  {e.nombreCompleto}
                </p>
                <p className="text-sm text-gray-500">
                  {e.fechaInicio
                    ? new Date(e.fechaInicio).toLocaleDateString()
                    : "Fecha no registrada"}{" "}
                  -{" "}
                  {e.fechaFin
                    ? new Date(e.fechaFin).toLocaleDateString()
                    : "En curso"}
                </p>
                {e.descripcion && (
                  <p className="text-xs text-gray-500 italic">
                    {e.descripcion}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">
            No hay empleados asignados a este vehículo.
          </p>
        )}

        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => onEdit(vehiculo)}
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(vehiculo)}
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

export default VehiculosDetails;
