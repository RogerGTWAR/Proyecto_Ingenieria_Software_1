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

    if (vehiculo) load();
  }, [vehiculo, reloadDetalles, reloadEmpleados]);

  const empleadosAsignados = useMemo(() => {
    if (!vehiculo?.id) return [];

    const detallesVehiculo = detalles.filter(
      (d) => Number(d.vehiculoId ?? d.vehiculo_id) === Number(vehiculo.id)
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

  if (!vehiculo) return null;

  const proveedorNombre =
    vehiculo.proveedorNombre ||
    vehiculo.proveedor ||
    vehiculo.proveedores?.nombre_empresa ||
    vehiculo.proveedores?.nombre_proveedor ||
    "—";

  const estadoClass = {
    Disponible: "border-emerald-200 bg-emerald-100 text-emerald-800",
    "En Mantenimiento": "border-amber-200 bg-amber-100 text-amber-800",
    "No Disponible": "border-red-200 bg-red-100 text-red-800",
  };

  return (
    <div
      className="
        fixed
        left-0
        right-0
        bottom-0
        top-16
        z-40
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-slate-900/35
        px-4
        py-6
        lg:left-48
      "
    >
      <div
        className="
          w-full
          max-w-5xl
          overflow-hidden
          rounded-3xl
          border
          border-slate-300
          bg-slate-100
          shadow-2xl
        "
      >
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white sm:px-7">
          <p className="text-sm font-medium text-cyan-100">
            Gestión de vehículos
          </p>

          <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
            {vehiculo.marca || "—"} {vehiculo.modelo || ""}
          </h2>
        </div>

        <div className="max-h-[calc(100dvh-170px)] space-y-5 overflow-y-auto p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información general
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Datos principales del vehículo seleccionado.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoBox label="Placa" value={vehiculo.placa || "—"} />
              <InfoBox label="Proveedor" value={proveedorNombre} />
              <InfoBox label="Año" value={vehiculo.anio || "—"} />
              <InfoBox
                label="Tipo de Vehículo"
                value={vehiculo.tipo_de_vehiculo || vehiculo.tipoVehiculo || "—"}
              />
              <InfoBox
                label="Combustible"
                value={
                  vehiculo.tipo_de_combustible ||
                  vehiculo.tipoCombustible ||
                  "—"
                }
              />

              <div
                className={`
                  rounded-2xl border p-4
                  ${
                    estadoClass[vehiculo.estado] ||
                    "border-slate-300 bg-slate-100 text-slate-800"
                  }
                `}
              >
                <p className="text-sm font-semibold opacity-80">Estado</p>
                <p className="mt-1 text-sm font-bold">
                  {vehiculo.estado || "—"}
                </p>
              </div>

              <InfoBox
                label="Fecha Registro"
                value={
                  vehiculo.fecha_registro
                    ? new Date(vehiculo.fecha_registro).toLocaleDateString()
                    : vehiculo.fechaRegistro || "—"
                }
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Empleados asignados
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Personal relacionado con este vehículo.
              </p>
            </div>

            {empleadosAsignados.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {empleadosAsignados.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
                  >
                    <p className="text-sm font-bold text-slate-900">
                      {e.nombreCompleto}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {e.fechaInicio
                        ? new Date(e.fechaInicio).toLocaleDateString()
                        : "Fecha no registrada"}{" "}
                      -{" "}
                      {e.fechaFin
                        ? new Date(e.fechaFin).toLocaleDateString()
                        : "En curso"}
                    </p>

                    {e.descripcion && (
                      <p className="mt-2 text-sm italic text-slate-500">
                        {e.descripcion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-400 bg-slate-100 px-6 py-8 text-center">
                <p className="text-sm font-bold text-slate-700">
                  No hay empleados asignados a este vehículo.
                </p>
              </div>
            )}
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-400 bg-slate-100 px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-300 sm:w-auto"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={() => onDelete(vehiculo)}
              className="w-full rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 sm:w-auto"
            >
              Eliminar
            </button>

            <button
              type="button"
              onClick={() => onEdit(vehiculo)}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl sm:w-auto"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4 text-slate-800">
    <p className="text-sm font-semibold opacity-80">{label}</p>
    <p className="mt-1 text-sm font-bold">{value}</p>
  </div>
);

export default VehiculosDetails;