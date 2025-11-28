import { useMemo, useState } from "react";
import ButtonList from "../components/ButtonList";
import EmpleadosCard from "../components/empleados/EmpleadosCard";
import EmpleadosDetails from "../components/empleados/EmpleadosDetails";
import EmpleadosForm from "../components/empleados/EmpleadosForm";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";
import { useEmpleados } from "../hooks/useEmpleados";
import useRoles from "../hooks/useRoles";

const normalize = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function EmpleadosPage() {
  const { items: empleados, loading, add, edit, remove } = useEmpleados();
  const { items: roles } = useRoles();

  const rolNameById = useMemo(
    () => Object.fromEntries(roles.map((r) => [Number(r.id), r.nombre])),
    [roles]
  );

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("all");

  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [empleadoAEditar, setEmpleadoAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const empleadosFiltrados = (empleados || []).filter((e) => {
    const q = busqueda.toLowerCase();
    const coincideBusqueda =
      e.nombres.toLowerCase().includes(q) ||
      e.apellidos.toLowerCase().includes(q);
    const coincideRol =
      filtroRol === "all" || Number(e.rolId) === Number(filtroRol);
    return coincideBusqueda && coincideRol;
  });

  const obtenerColorRol = (rolNombre) => {
    const key = normalize(rolNombre);
    const colores = {
      gerente: "bg-blue-100 text-blue-800",
      contador: "bg-green-100 text-green-800",
      asistente: "bg-yellow-100 text-yellow-800",
      ingeniero: "bg-purple-100 text-purple-800",
      recursos: "bg-pink-100 text-pink-800",
    };
    return colores[key] || "bg-gray-100 text-gray-800";
  };

  const abrirFormulario = () => {
    setEmpleadoAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarEmpleado = (empleado) => {
    setEmpleadoAEditar(empleado);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setVistaDetalle(false);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEmpleadoAEditar(null);
    setModoEdicion(false);
  };

const guardarEmpleado = async (data) => {
  try {
    const datosFormateados = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      cedula: data.cedula,
      correo: data.correo,
      telefono: data.telefono,
      pais: data.pais,
      direccion: data.direccion,
      fecha_nacimiento: data.fecha_nacimiento
        ? new Date(data.fecha_nacimiento).toISOString()
        : null,
      fecha_contratacion: data.fecha_contratacion
        ? new Date(data.fecha_contratacion).toISOString()
        : null,
      rol_id: Number(data.rolId),
    };

    if (modoEdicion && empleadoAEditar) {
      const actualizado = await edit(empleadoAEditar.id, datosFormateados);
      console.log("Empleado actualizado correctamente");

      if (vistaDetalle && empleadoSeleccionado?.id === empleadoAEditar.id) {
        setEmpleadoSeleccionado(actualizado);
      }
    } else {
      await add(datosFormateados);
      console.log("Empleado agregado correctamente");
    }

    cerrarFormulario();

  } catch (error) {
    console.error("Error al guardar empleado:", error);
  }
};


  const eliminarEmpleado = async () => {
    if (!empleadoAEliminar) return;
    setIsDeleting(true);
    await remove(empleadoAEliminar.id);
    setIsDeleting(false);
    setMostrarEliminar(false);
    setEmpleadoAEliminar(null);
    cerrarDetalles();
  };

  const verDetalles = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setEmpleadoSeleccionado(null);
  };

  const abrirEliminar = (empleado) => {
    setEmpleadoAEliminar(empleado);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setEmpleadoAEliminar(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <h1 className="heading-1 text-[var(--color-primary)] mb-2">
        Empleados
      </h1>
      <p className="body-1 text-[var(--color-gray)] mb-6">
        Gestión del personal de la empresa
      </p>

      <ButtonList
        buttons={[
          {
            id: "add",
            name: "Añadir",
            icon: "/icons/add.svg",
            coordinate: 4,
            action: abrirFormulario,
          },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="all">Todos los roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <EmpleadosCard
        empleados={empleadosFiltrados}
        rolNameById={rolNameById}
        obtenerColorRol={obtenerColorRol}
        onEdit={editarEmpleado}
        onDelete={abrirEliminar}
        onVerDetalles={verDetalles}
      />

      {vistaDetalle && (
        <EmpleadosDetails
          empleado={empleadoSeleccionado}
          onClose={cerrarDetalles}
          onEdit={editarEmpleado}
          onDelete={abrirEliminar}
          rolNameById={rolNameById}
        />
      )}

      {mostrarFormulario && (
        <EmpleadosForm
          onSubmit={guardarEmpleado}
          onClose={cerrarFormulario}
          initialData={empleadoAEditar}
          isEdit={modoEdicion}
          roles={roles}
        />
      )}

      {mostrarEliminar && (
        <DeleteConfirmationModal
          isOpen={mostrarEliminar}
          onClose={cerrarEliminar}
          onConfirm={eliminarEmpleado}
          itemName={
            empleadoAEliminar
              ? `${empleadoAEliminar.nombres} ${empleadoAEliminar.apellidos}`
              : ""
          }
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default EmpleadosPage;
