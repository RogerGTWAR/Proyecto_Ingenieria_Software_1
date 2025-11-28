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
      setForm(initialData);

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
  }, [initialData, detalles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const empleadosFiltrados = empleados.filter((e) =>
    `${e.nombres} ${e.apellidos}`.toLowerCase().includes(busqueda.toLowerCase())
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
      if (fin < min || fin > max) newErrors.fechaFin = "Debe estar entre 2000 y 2040.";
      if (inicio && fin < inicio)
        newErrors.fechaFin = "La fecha fin no puede ser menor que la fecha inicio.";
    }

    return newErrors;
  };

  const handleAsignarEmpleado = () => {
    const newErrors = validateEmpleadoAsignado();
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    const empleado = empleados.find((e) => e.id === Number(empleadoSeleccionado));
    if (!empleado) return;

    const yaAsignado = empleadosAsignados.some((e) => e.id === empleado.id);
    if (yaAsignado)
      return setErrors((prev) => ({
        ...prev,
        asignar: "Este empleado ya está asignado.",
      }));

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

    if (empleadosAsignados.length === 0)
      newErrors.asignacion = "Debe asignar al menos un empleado.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

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

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[100px] z-50">
      <form
        onSubmit={handleSubmit}
        className="
          bg-[#F9FAFB] rounded-2xl shadow-2xl border border-gray-200
          w-full max-w-3xl p-8
          max-h-[90vh] overflow-y-auto
        "
      >
        <h2 className="text-2xl font-semibold text-center text-[#1A2E81] mb-6">
          {isEdit ? "Editar Vehículo" : "Nuevo Vehículo"}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Proveedor
            </label>
            <select
              name="proveedor_id"
              value={form.proveedor_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Seleccione...</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre_empresa}
                </option>
              ))}
            </select>
            {errors.proveedor_id && (
              <p className="text-red-600 text-sm">{errors.proveedor_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option>Disponible</option>
              <option>No Disponible</option>
              <option>En Mantenimiento</option>
            </select>
            {errors.estado && (
              <p className="text-red-600 text-sm">{errors.estado}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Marca
            </label>
            <input
              type="text"
              name="marca"
              value={form.marca}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.marca && <p className="text-red-600 text-sm">{errors.marca}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Modelo
            </label>
            <input
              type="text"
              name="modelo"
              value={form.modelo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.modelo && <p className="text-red-600 text-sm">{errors.modelo}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Año
            </label>
            <input
              type="number"
              name="anio"
              value={form.anio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.anio && <p className="text-red-600 text-sm">{errors.anio}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Placa
            </label>
            <input
              type="text"
              name="placa"
              value={form.placa}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.placa && <p className="text-red-600 text-sm">{errors.placa}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Combustible
            </label>
            <select
              name="tipo_de_combustible"
              value={form.tipo_de_combustible}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Seleccione...</option>
              <option value="Diésel">Diésel</option>
              <option value="Regular">Regular</option>
              <option value="Gasolina Super">Gasolina Super</option>
            </select>
            {errors.tipo_de_combustible && (
              <p className="text-red-600 text-sm">{errors.tipo_de_combustible}</p>
            )}
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-[#1A2E81] mb-4">
            Empleados asignados al vehículo
          </h3>

          <input
            type="text"
            placeholder="Buscar empleado..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-3"
          />

          {busqueda && (
            <select
              className="w-full border border-gray-300 rounded-md p-2 mb-3"
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
            <p className="text-red-600 text-sm mb-2">{errors.asignar}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-900">Fecha inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              {errors.fechaInicio && (
                <p className="text-red-600 text-sm">{errors.fechaInicio}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-900">Fecha fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              {errors.fechaFin && (
                <p className="text-red-600 text-sm">{errors.fechaFin}</p>
              )}
            </div>
          </div>

          <textarea
            rows="2"
            placeholder="Descripción..."
            value={descripcionAsignacion}
            onChange={(e) => setDescripcionAsignacion(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          ></textarea>

          <button
            type="button"
            onClick={handleAsignarEmpleado}
            className="mt-4 px-6 py-2 rounded-md text-white shadow-md"
            style={{ backgroundColor: "#1A2E81" }}
          >
            Asignar
          </button>

          <div className="mt-5">
            {empleadosAsignados.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {empleadosAsignados.map((e) => (
                  <li key={e.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{e.nombre}</p>
                        <p className="text-sm text-gray-600">
                          Inicio: {e.fecha_inicio} / Fin: {e.fecha_fin || "—"}
                        </p>
                        <p className="text-xs text-gray-500 italic">{e.descripcion}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No hay empleados asignados.</p>
            )}

            {errors.asignacion && (
              <p className="text-red-600 text-sm mt-2">{errors.asignacion}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button
            type="submit"
            className="px-10 py-3 text-white rounded-md shadow-md"
            style={{ backgroundColor: "#1A2E81" }}
          >
            {isEdit ? "Actualizar" : "Guardar"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-10 py-3 bg-gray-300 text-gray-900 rounded-md shadow-md hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehiculosForm;