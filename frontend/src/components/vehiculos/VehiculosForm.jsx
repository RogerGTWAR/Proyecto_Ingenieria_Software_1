import React, { useState, useEffect } from "react";
import { useProveedores } from "../../hooks/useProveedores";
import { useEmpleados } from "../../hooks/useEmpleados";
import { useDetallesVehiculos } from "../../hooks/useDetallesVehiculos";

//Corregir detalleVehiculo
const VehiculosForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: proveedores } = useProveedores();
  const { items: empleados } = useEmpleados();
  const { add, reload, items: detalles } = useDetallesVehiculos();

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

  // ✅ Cargar datos al editar vehículo
  useEffect(() => {
    if (initialData && detalles.length > 0) {
      setForm(initialData);

      const asignacionesVehiculo = detalles
        .filter((d) => Number(d.vehiculoId) === Number(initialData.id))
        .map((d) => ({
          id: d.empleadoId,
          nombre:
            d.empleadoNombre && d.empleadoNombre !== "—"
              ? d.empleadoNombre
              : `Empleado #${d.empleadoId}`,
          fecha_inicio: d.fechaAsignacion || "",
          fecha_fin: d.fechaFinAsignacion || "",
          descripcion: d.descripcion || "Sin descripción",
        }));

      setEmpleadosAsignados(asignacionesVehiculo);
    }
  }, [initialData, detalles]);

  // 🟢 Cambios de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Buscar empleados
  const handleBuscar = (e) => setBusqueda(e.target.value);

  // 🟢 Asignar empleado a vehículo
  const handleAsignarEmpleado = () => {
    if (!empleadoSeleccionado) return alert("Seleccione un empleado.");
    if (!fechaInicio) return alert("Debe seleccionar la fecha de inicio.");

    const empleado = empleados.find(
      (e) => e.id === Number(empleadoSeleccionado)
    );
    if (!empleado) return;

    const yaAsignado = empleadosAsignados.some((e) => e.id === empleado.id);
    if (yaAsignado)
      return alert("Este empleado ya está asignado a este vehículo.");

    setEmpleadosAsignados((prev) => [
      ...prev,
      {
        id: empleado.id,
        nombre: `${empleado.nombres} ${empleado.apellidos}`,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin || "",
        descripcion: descripcionAsignacion || "Sin descripción",
      },
    ]);

    setEmpleadoSeleccionado("");
    setBusqueda("");
    setFechaInicio("");
    setFechaFin("");
    setDescripcionAsignacion("");
  };

  const handleQuitarEmpleado = async (id) => {
    try {
      const detalleExistente = detalles.find(
        (d) =>
          Number(d.empleadoId ?? d.empleado_id) === Number(id) &&
          Number(d.vehiculoId ?? d.vehiculo_id) === Number(form.id)
      );

      if (detalleExistente) {
        const detalleId =
          detalleExistente.id ??
          detalleExistente.detalle_vehiculo_id ??
          detalleExistente.detalleId;

        if (!detalleId) {
          console.warn("⚠️ No se encontró el ID del detalle para eliminar.");
          return;
        }


        // Llamar al hook remove() con el ID correcto
        await remove(detalleId);

        // Recargar la lista desde el backend
        await reload();

        // Actualizar estado local para reflejar los cambios
        setEmpleadosAsignados((prev) => prev.filter((e) => e.id !== id));
      } else {
        console.warn(
          `⚠️ No se encontró asignación activa para el empleado ${id} y vehículo ${form.id}`
        );
      }
    } catch (error) {
      console.error("❌ Error al eliminar detalle:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const vehiculoData = {
        proveedor_id: Number(form.proveedor_id) || null,
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        anio: Number(form.anio) || null,
        placa: form.placa.trim(),
        tipo_de_vehiculo: form.tipo_de_vehiculo || null,
        tipo_de_combustible: form.tipo_de_combustible || null,
        estado: form.estado,
        fecha_registro:
          form.fecha_registro || new Date().toISOString().split("T")[0],
      };

      const vehiculoGuardado = await onSubmit(vehiculoData);
      const vehiculoId = Number(vehiculoGuardado?.id);
      if (!vehiculoId) {
        alert("No se pudo obtener el ID del vehículo guardado.");
        return;
      }

      for (const emp of empleadosAsignados) {
        await add({
          empleado_id: emp.id,
          vehiculo_id: vehiculoId,
          fecha_asignacion: emp.fecha_inicio
            ? new Date(emp.fecha_inicio).toISOString()
            : new Date().toISOString(),
          fecha_fin_asignacion: emp.fecha_fin
            ? new Date(emp.fecha_fin).toISOString()
            : null,
          descripcion: emp.descripcion,
        });
      }

      await reload();
      onClose();
    } catch (error) {
      console.error("❌ Error al guardar vehículo:", error);
      alert("Error al guardar el vehículo.");
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-200 overflow-y-auto max-h-[100vh]"
      >
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">
          {isEdit ? "Editar Vehículo" : "Nuevo Vehículo"}
        </h2>

        {/* === Proveedor y Estado === */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Proveedor
            </label>
            <select
              name="proveedor_id"
              value={form.proveedor_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre_empresa}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option>Disponible</option>
              <option>En Mantenimiento</option>
              <option>No Disponible</option>
            </select>
          </div>
        </div>

        {/* === Marca, Modelo, Año, Placa, Tipo === */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">Marca</label>
            <input
              type="text"
              name="marca"
              value={form.marca}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-1">Modelo</label>
            <input
              type="text"
              name="modelo"
              value={form.modelo}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">Año</label>
            <input
              type="number"
              name="anio"
              value={form.anio}
              onChange={handleChange}
              min="1886"
              max={new Date().getFullYear()}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">Placa</label>
            <input
              type="text"
              name="placa"
              value={form.placa}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">Tipo</label>
            <input
              type="text"
              name="tipo_de_vehiculo"
              value={form.tipo_de_vehiculo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* === Combustible === */}
        <div className="mb-8">
          <label className="block text-gray-900 font-medium mb-1">
            Combustible
          </label>
          <select
            name="tipo_de_combustible"
            value={form.tipo_de_combustible}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">Seleccione...</option>
            <option value="Diésel">Diésel</option>
            <option value="Regular">Regular</option>
            <option value="Gasolina Super">Gasolina Super</option>
          </select>
        </div>

        {/* === Empleados Asignados === */}
        <div className="border-t border-gray-300 mt-4 pt-6">
          <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
            Empleados Asignados
          </h3>

          <div className="flex flex-col gap-3 mb-4">
            <input
              type="text"
              placeholder="Buscar empleado..."
              value={busqueda}
              onChange={handleBuscar}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            />

            {busqueda && (
              <select
                value={empleadoSeleccionado}
                onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="">Seleccionar...</option>
                {empleadosFiltrados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombres} {e.apellidos}
                  </option>
                ))}
              </select>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-900 text-sm mb-1">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-900 text-sm mb-1">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-900 text-sm mb-1">
                Descripción
              </label>
              <textarea
                rows="2"
                value={descripcionAsignacion}
                onChange={(e) => setDescripcionAsignacion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Ej: Asignación temporal para mantenimiento"
              ></textarea>
            </div>

            <button
              type="button"
              onClick={handleAsignarEmpleado}
              className="text-white font-medium px-4 py-2 rounded-md transition hover:scale-105"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Asignar
            </button>
          </div>

          {/* Lista de asignaciones */}
          {empleadosAsignados.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {empleadosAsignados.map((e) => (
                <li key={e.id} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{e.nombre}</p>
                      <p className="text-sm text-gray-600">
                        Inicio: {e.fecha_inicio || "—"} | Fin:{" "}
                        {e.fecha_fin || "—"}
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        {e.descripcion}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuitarEmpleado(e.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No hay empleados asignados.</p>
          )}
        </div>

        {/* === Botones === */}
        <div className="flex justify-center gap-6 mt-10">
          <button
            type="submit"
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            {isEdit ? "Actualizar" : "Guardar"}
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

export default VehiculosForm;
