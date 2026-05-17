import React, { useState, useEffect } from "react";
import { useProveedores } from "../../hooks/useProveedores";
import { useEmpleados } from "../../hooks/useEmpleados";
import { useDetallesVehiculos } from "../../hooks/useDetallesVehiculos";

const VehiculosForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: proveedores } = useProveedores();
  const { items: empleados } = useEmpleados();
  const { add, reload, items: detalles } = useDetallesVehiculos();

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    proveedor_id: "",
    marca: "",
    modelo: "",
    anio: "",
    placa: "",
    tipo_de_vehiculo: "",
    tipo_de_combustible: "",
    estado: "Disponible",
    fecha_registro: "",
  });

  const [empleadosAsignados, setEmpleadosAsignados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [descripcionAsignacion, setDescripcionAsignacion] = useState("");

  useEffect(() => {
    if (initialData && detalles.length > 0) {
      setForm({
        proveedor_id: initialData.proveedor_id ?? "",
        marca: initialData.marca ?? "",
        modelo: initialData.modelo ?? "",
        anio: initialData.anio ?? "",
        placa: initialData.placa ?? "",
        tipo_de_vehiculo: initialData.tipo_de_vehiculo ?? "",
        tipo_de_combustible: initialData.tipo_de_combustible ?? "",
        estado: initialData.estado ?? "Disponible",
        fecha_registro: initialData.fecha_registro ?? "",
      });

      const asignacionesVehiculo = detalles
        .filter((d) => Number(d.vehiculoId) === Number(initialData.id))
        .map((d) => ({
          id: d.empleadoId,
          nombre: d.empleadoNombre ?? `Empleado #${d.empleadoId}`,
          fecha_inicio: d.fechaAsignacion || "",
          fecha_fin: d.fechaFinAsignacion || "",
          descripcion: d.descripcion || "Sin descripción",
        }));

      setEmpleadosAsignados(asignacionesVehiculo);
    }

    if (!initialData) {
      setForm({
        proveedor_id: "",
        marca: "",
        modelo: "",
        anio: "",
        placa: "",
        tipo_de_vehiculo: "",
        tipo_de_combustible: "",
        estado: "Disponible",
        fecha_registro: "",
      });

      setEmpleadosAsignados([]);
    }
  }, [initialData, detalles]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const empleadosFiltrados = empleados.filter((e) =>
    `${e.nombres} ${e.apellidos}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const validateEmpleadoAsignado = () => {
    const newErrors = {};

    if (!empleadoSeleccionado) {
      newErrors.asignar = "Debe seleccionar un empleado.";
      return newErrors;
    }

    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;
    const min = new Date("2000-01-01");
    const max = new Date("2040-12-31");

    if (!fechaInicio) {
      newErrors.fechaInicio = "Debe seleccionar una fecha de inicio.";
    } else if (inicio < min || inicio > max) {
      newErrors.fechaInicio = "Debe estar entre 2000 y 2040.";
    }

    if (fechaFin) {
      if (fin < min || fin > max) {
        newErrors.fechaFin = "Debe estar entre 2000 y 2040.";
      }

      if (inicio && fin < inicio) {
        newErrors.fechaFin =
          "La fecha fin no puede ser menor que la fecha inicio.";
      }
    }

    return newErrors;
  };

  const handleAsignarEmpleado = () => {
    const newErrors = validateEmpleadoAsignado();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const empleado = empleados.find(
      (e) => e.id === Number(empleadoSeleccionado)
    );

    if (!empleado) return;

    const yaAsignado = empleadosAsignados.some((e) => e.id === empleado.id);

    if (yaAsignado) {
      setErrors((prev) => ({
        ...prev,
        asignar: "Este empleado ya está asignado.",
      }));
      return;
    }

    setEmpleadosAsignados((prev) => [
      ...prev,
      {
        id: empleado.id,
        nombre: `${empleado.nombres} ${empleado.apellidos}`,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        descripcion: descripcionAsignacion || "Sin descripción",
      },
    ]);

    setEmpleadoSeleccionado("");
    setBusqueda("");
    setFechaInicio("");
    setFechaFin("");
    setDescripcionAsignacion("");
    setErrors((prev) => ({ ...prev, asignar: "" }));
  };

  const quitarEmpleadoAsignado = (id) => {
    setEmpleadosAsignados((prev) =>
      prev.filter((e) => Number(e.id) !== Number(id))
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.proveedor_id) newErrors.proveedor_id = "Debe seleccionar un proveedor.";
    if (!form.estado) newErrors.estado = "Debe seleccionar un estado.";
    if (!form.marca.trim()) newErrors.marca = "La marca es obligatoria.";
    if (!form.modelo.trim()) newErrors.modelo = "El modelo es obligatorio.";
    if (!form.placa.trim()) newErrors.placa = "La placa es obligatoria.";
    if (!form.tipo_de_combustible)
      newErrors.tipo_de_combustible = "Seleccione un tipo de combustible.";

    if (!form.anio) {
      newErrors.anio = "El año es obligatorio.";
    } else if (Number(form.anio) < 2000 || Number(form.anio) > 2040) {
      newErrors.anio = "El año debe estar entre 2000 y 2040.";
    }

    if (empleadosAsignados.length === 0) {
      newErrors.asignacion = "Debe asignar al menos un empleado.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const vehiculoGuardado = await onSubmit(form);
    const vehiculoId = Number(vehiculoGuardado?.id);

    for (const emp of empleadosAsignados) {
      await add({
        empleado_id: emp.id,
        vehiculo_id: vehiculoId,
        fecha_asignacion: emp.fecha_inicio,
        fecha_fin_asignacion: emp.fecha_fin || null,
        descripcion: emp.descripcion,
      });
    }

    await reload();
    onClose();
  };

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-300 bg-slate-100 px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  const errorClass = "mt-1 text-sm font-medium text-red-600";

  return (
    <div className="fixed left-0 right-0 bottom-0 top-16 z-40 flex items-center justify-center overflow-y-auto bg-slate-900/35 px-4 py-6 lg:left-48">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-6xl max-h-[calc(100dvh-96px)] flex-col overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 shadow-2xl"
      >
        <div className="shrink-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white shadow-lg sm:px-7">
          <p className="text-sm font-medium text-cyan-100">
            Gestión de vehículos
          </p>

          <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
            {isEdit ? "Editar Vehículo" : "Nuevo Vehículo"}
          </h2>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información del vehículo
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Complete los datos principales del vehículo.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass}>Proveedor</label>
                <select
                  name="proveedor_id"
                  value={form.proveedor_id}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Seleccione...</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre_empresa}
                    </option>
                  ))}
                </select>
                {errors.proveedor_id && (
                  <p className={errorClass}>{errors.proveedor_id}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Estado</label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Disponible</option>
                  <option>No Disponible</option>
                  <option>En Mantenimiento</option>
                </select>
                {errors.estado && (
                  <p className={errorClass}>{errors.estado}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={form.marca}
                  onChange={handleChange}
                  placeholder="Ejemplo: Toyota"
                  className={inputClass}
                />
                {errors.marca && (
                  <p className={errorClass}>{errors.marca}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  placeholder="Ejemplo: Hilux"
                  className={inputClass}
                />
                {errors.modelo && (
                  <p className={errorClass}>{errors.modelo}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Año</label>
                <input
                  type="number"
                  name="anio"
                  value={form.anio}
                  onChange={handleChange}
                  placeholder="Ejemplo: 2024"
                  className={inputClass}
                />
                {errors.anio && <p className={errorClass}>{errors.anio}</p>}
              </div>

              <div>
                <label className={labelClass}>Placa</label>
                <input
                  type="text"
                  name="placa"
                  value={form.placa}
                  onChange={handleChange}
                  placeholder="Ejemplo: M123456"
                  className={inputClass}
                />
                {errors.placa && <p className={errorClass}>{errors.placa}</p>}
              </div>

              <div>
                <label className={labelClass}>Combustible</label>
                <select
                  name="tipo_de_combustible"
                  value={form.tipo_de_combustible}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Seleccione...</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Regular">Regular</option>
                  <option value="Gasolina Super">Gasolina Super</option>
                </select>
                {errors.tipo_de_combustible && (
                  <p className={errorClass}>{errors.tipo_de_combustible}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Tipo de Vehículo</label>
                <input
                  type="text"
                  name="tipo_de_vehiculo"
                  value={form.tipo_de_vehiculo}
                  onChange={handleChange}
                  placeholder="Ejemplo: Camioneta"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Empleados asignados al vehículo
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Seleccione el empleado y el periodo de asignación.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <label className={labelClass}>Buscar empleado</label>
                <input
                  type="text"
                  placeholder="Buscar empleado..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className={inputClass}
                />

                {busqueda && (
                  <select
                    className={`${inputClass} mt-3`}
                    value={empleadoSeleccionado}
                    onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                  >
                    <option value="">Seleccione...</option>
                    {empleadosFiltrados.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nombres} {e.apellidos}
                      </option>
                    ))}
                  </select>
                )}

                {errors.asignar && (
                  <p className={errorClass}>{errors.asignar}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Fecha inicio</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className={inputClass}
                  />
                  {errors.fechaInicio && (
                    <p className={errorClass}>{errors.fechaInicio}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Fecha fin</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className={inputClass}
                  />
                  {errors.fechaFin && (
                    <p className={errorClass}>{errors.fechaFin}</p>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className={labelClass}>Descripción</label>
                <textarea
                  rows="2"
                  placeholder="Descripción..."
                  value={descripcionAsignacion}
                  onChange={(e) => setDescripcionAsignacion(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAsignarEmpleado}
              className="mt-4 rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl"
            >
              Asignar
            </button>

            <div className="mt-5">
              {empleadosAsignados.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {empleadosAsignados.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-2xl border border-slate-300 bg-slate-100 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {e.nombre}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            Inicio: {e.fecha_inicio} / Fin:{" "}
                            {e.fecha_fin || "—"}
                          </p>
                          <p className="mt-1 text-sm italic text-slate-500">
                            {e.descripcion}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => quitarEmpleadoAsignado(e.id)}
                          className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-200"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-400 bg-slate-100 px-6 py-8 text-center">
                  <p className="text-sm font-bold text-slate-700">
                    No hay empleados asignados.
                  </p>
                </div>
              )}

              {errors.asignacion && (
                <p className={errorClass}>{errors.asignacion}</p>
              )}
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-slate-300 bg-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-400 bg-slate-100 px-8 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-300 sm:w-auto"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl sm:w-auto"
            >
              {isEdit ? "Actualizar Vehículo" : "Guardar Vehículo"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VehiculosForm;