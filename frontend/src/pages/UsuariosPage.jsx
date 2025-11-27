import { useState, useEffect } from "react";

import ButtonList from "../components/ButtonList";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import UsuariosCard from "../components/usuarios/UsuariosCard";
import UsuariosTable from "../components/usuarios/UsuariosTable";
import UsuariosDetails from "../components/usuarios/UsuariosDetails";
import UsuariosForm from "../components/usuarios/UsuariosForm";

import { useUsuarios } from "../hooks/useUsuarios";
import { useEmpleados } from "../hooks/useEmpleados";
import useRoles from "../hooks/useRoles";

function UsuariosPage() {
  const {
    items: usuarios,
    loading,
    add,
    edit,
    remove,
    reload: reloadUsuarios
  } = useUsuarios();

  const { reload: reloadEmpleados } = useEmpleados();
  const { reload: reloadRoles } = useRoles();

  const [busqueda, setBusqueda] = useState("");

  const [vistaTarjetas, setVistaTarjetas] = useState(true);

  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    reloadEmpleados();
    reloadRoles();
  }, []);

  const usuariosFiltrados = usuarios.filter((u) => {
    const t = busqueda.toLowerCase();
    return (
      u.usuario?.toLowerCase().includes(t) ||
      u.nombres?.toLowerCase().includes(t) ||
      u.apellidos?.toLowerCase().includes(t) ||
      u.cargo?.toLowerCase().includes(t)
    );
  });

  const abrirFormulario = () => {
    setUsuarioAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarUsuario = (usuario) => {
    setUsuarioAEditar(usuario);
    setModoEdicion(true);
    setVistaDetalle(false);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setUsuarioAEditar(null);
    setModoEdicion(false);
  };

  const guardarUsuario = async (data) => {
    if (modoEdicion) {
      await edit(usuarioAEditar.usuario_id, data);
    } else {
      await add(data);
    }

    await reloadUsuarios();
    await reloadEmpleados();
    await reloadRoles();    

    return true;
  };

  const verDetalles = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setUsuarioSeleccionado(null);
  };

  const abrirEliminar = (usuario) => {
    setUsuarioAEliminar(usuario);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setUsuarioAEliminar(null);
    setMostrarEliminar(false);
  };

  const eliminarUsuario = async () => {
    setIsDeleting(true);
    await remove(usuarioAEliminar.usuario_id);

    await reloadUsuarios();
    await reloadEmpleados();
    await reloadRoles();

    setIsDeleting(false);
    cerrarEliminar();
    setVistaDetalle(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[var(--color-primary)] text-lg font-semibold">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">

      <h1 className="heading-1 text-[var(--color-primary)] mb-2">Usuarios</h1>
      <p className="body-1 text-[var(--color-gray)] mb-6">
        Gestión de cuentas de usuario y asignación de roles
      </p>

      <ButtonList
        buttons={[
          {
            id: "add",
            name: "Registrar Usuario",
            icon: "/icons/add.svg",
            coordinate: 4,
            action: abrirFormulario,
          },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4 mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar usuario, nombre o rol..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
        />

        <button
          onClick={() => setVistaTarjetas(!vistaTarjetas)}
          className="px-5 py-2 rounded-lg shadow-md text-white font-medium bg-[#1A2E81]"
        >
          {vistaTarjetas ? "Vista: Tarjetas" : "Vista: Tabla"}
        </button>
      </div>

      {vistaTarjetas ? (
        <UsuariosCard
          usuarios={usuariosFiltrados}
          onEdit={editarUsuario}
          onDelete={abrirEliminar}
          onVerDetalles={verDetalles}
        />
      ) : (
        <UsuariosTable
          usuarios={usuariosFiltrados}
          onEdit={editarUsuario}
          onDelete={abrirEliminar}
          onVerDetalles={verDetalles}
        />
      )}

      {vistaDetalle && usuarioSeleccionado && (
        <UsuariosDetails
          usuario={usuarioSeleccionado}
          onClose={cerrarDetalles}
          onEdit={editarUsuario}
          onDelete={abrirEliminar}
        />
      )}

      {mostrarFormulario && (
        <UsuariosForm
          onSubmit={guardarUsuario}
          onClose={cerrarFormulario}
          initialData={usuarioAEditar}
          isEdit={modoEdicion}
        />
      )}

      {mostrarEliminar && (
        <DeleteConfirmationModal
          isOpen={mostrarEliminar}
          onClose={cerrarEliminar}
          onConfirm={eliminarUsuario}
          itemName={usuarioAEliminar?.usuario || ""}
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default UsuariosPage;
