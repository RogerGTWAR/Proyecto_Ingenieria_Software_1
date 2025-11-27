import React, { useState, useEffect } from "react";
import { useClientes } from "../../hooks/useClientes";
import { useEmpleados } from "../../hooks/useEmpleados";
import { useDetallesEmpleados } from "../../hooks/useDetallesEmpleados";

const ProyectosForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: clientes } = useClientes();
  const { items: empleados } = useEmpleados();
  const { items: detalles, add, edit, remove, reload } = useDetallesEmpleados();

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    id: "",
    clienteId: "",
    nombreProyecto: "",
    descripcion: "",
    ubicacion: "",
    fechaInicio: "",
    fechaFin: "",
    presupuestoTotal: "",
    estado: "En Espera",
  });

  const [empleadosAsignados, setEmpleadosAsignados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");

  useEffect(() => {
    if (initialData && detalles.length > 0 && empleados.length > 0) {
      setForm(initialData);

      const asignados = detalles
        .filter(
          (d) =>
            Number(d.proyecto_id ?? d.proyectoId) === Number(initialData.id)
        )
        .map((d) => {
          const emp = empleados.find(
            (e) => Number(e.id) === Number(d.empleado_id ?? d.empleadoId)
          );

          return {
            id: emp?.id ?? d.empleado_id,
            nombre: emp
              ? `${emp.nombres} ${emp.apellidos}`
              : `Empleado #${d.empleado_id}`,
            rol: emp?.rolNombre ?? "Sin rol",
            fecha:
              d.fecha_de_proyecto ??
              d.fechaProyecto ??
              new Date().toISOString(),
          };
        });

      setEmpleadosAsignados(asignados);
    }
  }, [initialData, detalles, empleados]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBuscar = (e) => setBusqueda(e.target.value);

  const handleAsignarEmpleado = () => {
    if (!empleadoSeleccionado) {
      setErrors((prev) => ({
        ...prev,
        asignar: "Debe seleccionar un empleado."
      }));
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
        asignar: "Este empleado ya está asignado."
      }));
      return;
    }

    setEmpleadosAsignados((prev) => [
      ...prev,
      {
        id: empleado.id,
        nombre: `${empleado.nombres} ${empleado.apellidos}`,
        rol: empleado.rolNombre,
        fecha: new Date().toISOString(),
      },
    ]);

    setEmpleadoSeleccionado("");
    setBusqueda("");
    setErrors((prev) => ({ ...prev, asignar: "" }));
  };

  const handleQuitarEmpleado = async (id) => {
    try {
      const detalleExistente = detalles.find(
        (d) =>
          Number(d.empleadoId) === Number(id) &&
          Number(d.proyectoId) === Number(form.id)
      );

      if (detalleExistente) {
        await remove(detalleExistente.id);
        await reload();
      }

      setEmpleadosAsignados((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error al eliminar detalle:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.clienteId) newErrors.clienteId = "Seleccione un cliente.";

    if (!form.nombreProyecto.trim())
      newErrors.nombreProyecto = "El nombre del proyecto es obligatorio.";

    if (!form.presupuestoTotal || Number(form.presupuestoTotal) <= 0)
      newErrors.presupuestoTotal = "Debe ingresar un presupuesto válido.";

    const minFecha = new Date("2000-01-01");
    const maxFecha = new Date("2040-12-31");

    if (!form.fechaInicio) {
      newErrors.fechaInicio = "La fecha de inicio es obligatoria.";
    } else {
      const inicio = new Date(form.fechaInicio);
      if (inicio < minFecha || inicio > maxFecha)
        newErrors.fechaInicio = "Debe estar entre 2000 y 2040.";
    }

    if (!form.fechaFin) {
      newErrors.fechaFin = "La fecha de fin es obligatoria.";
    } else {
      const fin = new Date(form.fechaFin);
      if (fin < minFecha || fin > maxFecha)
        newErrors.fechaFin = "Debe estar entre 2000 y 2040.";

      if (form.fechaInicio && new Date(form.fechaFin) < new Date(form.fechaInicio))
        newErrors.fechaFin = "La fecha de fin no puede ser menor a la fecha de inicio.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const proyectoGuardado = await onSubmit(form);
      const proyectoId = Number(proyectoGuardado?.id);

      for (const emp of empleadosAsignados) {
        const existe = detalles.find(
          (d) =>
            Number(d.empleadoId) === Number(emp.id) &&
            Number(d.proyectoId) === proyectoId
        );

        if (existe) {
          await edit(existe.id, { fecha_eliminacion: null });
        } else {
          await add({
            empleadoId: emp.id,
            proyectoId,
            fechaProyecto: new Date().toISOString(),
          });
        }
      }

      await reload();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const empleadosFiltrados = empleados.filter((e) =>
    `${e.nombres} ${e.apellidos}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[100vh]"
      >
        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4 text-center">
          {isEdit ? "Editar Proyecto" : "Nuevo Proyecto"}
        </h2>

        {/* CLIENTE / ESTADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Cliente</label>
            <select
              name="clienteId"
              value={form.clienteId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombreEmpresa}</option>
              ))}
            </select>
            {errors.clienteId && <p className="text-red-600 text-sm">{errors.clienteId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Estado</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="En Espera">En Espera</option>
              <option value="Activo">Activo</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

        </div>

        {/* NOMBRE / DESCRIPCIÓN */}
        <div className="space-y-2 mb-4">

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Nombre del Proyecto
            </label>
            <input
              type="text"
              name="nombreProyecto"
              value={form.nombreProyecto}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.nombreProyecto && (
              <p className="text-red-600 text-sm">{errors.nombreProyecto}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* UBICACIÓN / PRESUPUESTO */}
        <div className="grid grid-cols-2 gap-4 mb-4">

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Presupuesto Total (C$)
            </label>
            <input
              type="number"
              name="presupuestoTotal"
              value={form.presupuestoTotal}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.presupuestoTotal && (
              <p className="text-red-600 text-sm">{errors.presupuestoTotal}</p>
            )}
          </div>

        </div>

        {/* FECHAS */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.fechaInicio && (
              <p className="text-red-600 text-sm">{errors.fechaInicio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Fecha de Fin
            </label>
            <input
              type="date"
              name="fechaFin"
              value={form.fechaFin}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.fechaFin && (
              <p className="text-red-600 text-sm">{errors.fechaFin}</p>
            )}
          </div>

        </div>

        {/* ASIGNAR EMPLEADOS */}
        <div className="border-t border-gray-300 mt-4 pt-4">
          <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
            Empleados Asignados
          </h3>

          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar empleado..."
                value={busqueda}
                onChange={handleBuscar}
                className="w-full border border-gray-300 rounded-md p-2"
              />

              {busqueda && (
                <select
                  value={empleadoSeleccionado}
                  onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                  className="w-full border border-gray-300 rounded-md mt-2 p-2"
                >
                  <option value="">Seleccionar empleado...</option>
                  {empleadosFiltrados.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombres} {e.apellidos} — {e.rolNombre}
                    </option>
                  ))}
                </select>
              )}

              {errors.asignar && (
                <p className="text-red-600 text-sm mt-1">{errors.asignar}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleAsignarEmpleado}
              className="text-white px-4 py-2 rounded-md"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Asignar
            </button>
          </div>

          {empleadosAsignados.length > 0 && (
            <div className="bg-gray-100 rounded-lg p-3 shadow-inner">
              <ul className="divide-y divide-gray-200">
                {empleadosAsignados.map((e) => (
                  <li
                    key={e.id}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <span className="font-medium">{e.nombre}</span>
                      <p className="text-sm text-gray-600">{e.rol}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(e.fecha).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuitarEmpleado(e.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* BOTONES */}
        <div className="flex justify-center gap-6 mt-10">
          <button
            type="submit"
            className="text-white px-7 py-3 rounded-md"
            style={{ backgroundColor: "#1A2E81" }}
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-900 px-7 py-3 rounded-md"
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProyectosForm;
