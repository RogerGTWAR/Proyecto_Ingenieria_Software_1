import { useState } from "react";
import ButtonList from "../components/ButtonList";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import ClientesCard from "../components/clientes/ClientesCard";
import ClientesTable from "../components/clientes/ClientesTable";
import ClientesForm from "../components/clientes/ClientesForm";
import ClientesDetails from "../components/clientes/ClientesDetails";

import ActionFeedback from "../components/ui/ActionFeedback"; 

import { useClientes } from "../hooks/useClientes";

function ClientesPage() {
  const { items: clientes, loading, add, edit, remove } = useClientes();

  const [busqueda, setBusqueda] = useState("");
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [vistaTarjetas, setVistaTarjetas] = useState(true);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const clientesFiltrados = (clientes || []).filter((c) => {
    const q = busqueda.toLowerCase();
    return (
      c.nombreEmpresa.toLowerCase().includes(q) ||
      c.nombreContacto.toLowerCase().includes(q)
    );
  });

  const abrirFormulario = () => {
    setClienteAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarCliente = (cliente) => {
    setClienteAEditar(cliente);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setVistaDetalle(false);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setClienteAEditar(null);
    setModoEdicion(false);
  };

  const guardarCliente = async (data) => {
    try {
      const datos = {
        id: data.id,
        nombreEmpresa: data.nombreEmpresa,
        nombreContacto: data.nombreContacto,
        cargoContacto: data.cargoContacto,
        direccion: data.direccion,
        ciudad: data.ciudad,
        pais: data.pais,
        telefono: data.telefono,
      };

      if (modoEdicion && clienteAEditar) {
        const actualizado = await edit(clienteAEditar.id, datos);

        if (vistaDetalle && clienteSeleccionado?.id === clienteAEditar.id) {
          setClienteSeleccionado(actualizado);
        }

        setFeedbackMessage("Cliente actualizado con éxito");
      } else {
        await add(datos);
        setFeedbackMessage("Cliente creado con éxito");
      }

      setFeedbackOpen(true);
      cerrarFormulario();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    }
  };

  const verDetalles = (cliente) => {
    setClienteSeleccionado(cliente);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setClienteSeleccionado(null);
  };

  const abrirEliminar = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setClienteAEliminar(null);
  };

  const eliminarCliente = async () => {
    if (!clienteAEliminar) return;
    setIsDeleting(true);

    await remove(clienteAEliminar.id);

    setFeedbackMessage("Cliente eliminado con éxito");
    setFeedbackOpen(true);

    setIsDeleting(false);
    cerrarEliminar();
    cerrarDetalles();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[var(--color-primary)] text-lg font-semibold">
        Cargando clientes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">

      <h1 className="heading-1 text-[var(--color-primary)] mb-2">Clientes</h1>
      <p className="body-1 text-[var(--color-gray)] mb-6">Gestión de clientes registrados</p>

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

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4 mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por empresa o contacto..."
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
        <ClientesCard
          clientes={clientesFiltrados}
          onEdit={editarCliente}
          onDelete={abrirEliminar}
          onVerDetalles={verDetalles}
        />
      ) : (
        <ClientesTable
          clientes={clientesFiltrados}
          onEdit={editarCliente}
          onDelete={abrirEliminar}
          onVerDetalles={verDetalles}
        />
      )}

      {vistaDetalle && (
        <ClientesDetails
          cliente={clienteSeleccionado}
          onClose={cerrarDetalles}
          onEdit={editarCliente}
          onDelete={abrirEliminar}
        />
      )}

      {mostrarFormulario && (
        <ClientesForm
          onSubmit={guardarCliente}
          onClose={cerrarFormulario}
          initialData={clienteAEditar}
          isEdit={modoEdicion}
        />
      )}

      {mostrarEliminar && (
        <DeleteConfirmationModal
          isOpen={mostrarEliminar}
          onClose={cerrarEliminar}
          onConfirm={eliminarCliente}
          itemName={clienteAEliminar?.nombreEmpresa || ""}
          loading={isDeleting}
        />
      )}

      <ActionFeedback
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        message={feedbackMessage}
      />
    </div>
  );
}

export default ClientesPage;
