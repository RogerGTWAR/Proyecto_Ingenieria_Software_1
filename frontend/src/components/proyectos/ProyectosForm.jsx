import React, { useState, useEffect } from "react";
import { useClientes } from "../../hooks/useClientes";
import { useEmpleados } from "../../hooks/useEmpleados";
import { useDetallesEmpleados } from "../../hooks/useDetallesEmpleados";

const ProyectosForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: clientes } = useClientes();
  const { items: empleados } = useEmpleados();
  const { items: detalles, add, edit, remove, reload } = useDetallesEmpleados();

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
  };

  const handleBuscar = (e) => setBusqueda(e.target.value);

  const handleAsignarEmpleado = () => {
    if (!empleadoSeleccionado) return;

    const empleado = empleados.find(
      (e) => e.id === Number(empleadoSeleccionado)
    );
    if (!empleado) return;

    const yaAsignado = empleadosAsignados.some((e) => e.id === empleado.id);
    if (yaAsignado) return alert("Este empleado ya está asignado.");

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
        console.log(`🗑️ Eliminado: Empleado ${id} del Proyecto ${form.id}`);
        await reload();
      }

      setEmpleadosAsignados((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar detalle:", error);
      alert("Error al eliminar el empleado del proyecto.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const proyectoGuardado = await onSubmit(form);
      const proyectoId = Number(proyectoGuardado?.id);
      if (!proyectoId) {
        alert("No se pudo obtener el ID del proyecto guardado.");
        return;
      }

      for (const emp of empleadosAsignados) {
        const detalleExistente = detalles.find(
          (d) =>
            Number(d.empleadoId) === Number(emp.id) &&
            Number(d.proyectoId) === proyectoId
        );

        if (detalleExistente) {
          if (
            detalleExistente.fecha_eliminacion ||
            detalleExistente.fechaEliminacion
          ) {
            console.log(`♻️ Reactivando detalle eliminado (${emp.id})`);
            await edit(detalleExistente.id, {
              fecha_eliminacion: null,
              fechaProyecto: new Date().toISOString(),
            });
          }
        } else {
          await add({
            empleadoId: emp.id,
            proyectoId,
            fechaProyecto: new Date().toISOString(),
          });
          console.log(`Empleado ${emp.id} agregado al proyecto ${proyectoId}`);
        }
      }

      await reload();
      onClose();
      console.log("Proyecto guardado y empleados actualizados correctamente");
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      alert("No se pudo guardar el proyecto.");
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

        {/* === Cliente y estado === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Cliente
            </label>
            <select
              name="clienteId"
              value={form.clienteId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombreEmpresa}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="En Espera">En Espera</option>
              <option value="Activo">Activo</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* === Nombre y descripción === */}
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
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            />
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
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* === Ubicación y presupuesto === */}
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
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
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
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* === Fechas === */}
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
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
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
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* === Empleados asignados === */}
        <div className="border-t border-gray-300 mt-4 pt-4">
          <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
            Empleados Asignados
          </h3>

          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar empleado por nombre o apellido..."
                value={busqueda}
                onChange={handleBuscar}
                className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              {busqueda && (
                <select
                  value={empleadoSeleccionado}
                  onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                  className="w-full border border-gray-300 rounded-md mt-2 p-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Seleccionar empleado...</option>
                  {empleadosFiltrados.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombres} {e.apellidos} — {e.rolNombre}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <button
              type="button"
              onClick={handleAsignarEmpleado}
              className="text-white px-4 py-2 rounded-md transition hover:scale-105"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Asignar
            </button>
          </div>

          {empleadosAsignados.length > 0 ? (
            <div className="bg-[var(--color-fifth)] rounded-lg p-3 shadow-inner">
              <ul className="divide-y divide-gray-200">
                {empleadosAsignados.map((e) => (
                  <li
                    key={e.id}
                    className="flex justify-between items-center py-2 text-gray-900"
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
          ) : (
            <p className="text-gray-500 italic mb-4">
              No hay empleados asignados.
            </p>
          )}
        </div>

        {/* === Botones === */}
        <div className="flex justify-center gap-6 mt-10">
          <button
            type="submit"
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-900 text-base font-medium px-7 py-3 rounded-md hover:bg-gray-400 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProyectosForm;
