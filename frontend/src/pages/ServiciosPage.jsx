//Listo
import { useState } from "react";
import ButtonList from "../components/ButtonList";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";
import ServiciosCard from "../components/servicios/ServiciosCard";
import ServiciosDetails from "../components/servicios/ServiciosDetails";
import ServiciosForm from "../components/servicios/ServiciosForm";
import { useServicios } from "../hooks/useServicios";

function ServiciosPage() {
  const { items: servicios, loading, add, edit, remove, reload } = useServicios();
  const [busqueda, setBusqueda] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [servicioAEditar, setServicioAEditar] = useState(null);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const serviciosFiltrados = servicios.filter((s) =>
    s.nombreServicio.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormulario = () => {
    setServicioAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarServicio = (servicio) => {
    setServicioAEditar(servicio);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setServicioAEditar(null);
    setModoEdicion(false);
  };

  const guardarServicio = async (data) => {
    try {
      let actualizado = null;

      if (modoEdicion && servicioAEditar) {
        actualizado = await edit(servicioAEditar.id, data);

        if (vistaDetalle && servicioSeleccionado?.id === servicioAEditar.id) {
          setVistaDetalle(false);
          setServicioSeleccionado(null);
        }

        setServicioAEditar(actualizado);
      } else {
        actualizado = await add(data);
      }

      await reload();
      cerrarFormulario();
      return actualizado;
    } catch (e) {
      console.error("Error al guardar servicio:", e);
      alert("No se pudo guardar el servicio.");
    }
  };

  const abrirDetalles = (servicio) => {
    setServicioSeleccionado(servicio);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setServicioSeleccionado(null);
  };

  const abrirEliminar = (servicio) => {
    setServicioAEliminar(servicio);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setServicioAEliminar(null);
  };

  const eliminarServicio = async () => {
    if (!servicioAEliminar) return;
    setIsDeleting(true);
    try {
      await remove(servicioAEliminar.id);
      await reload();
      setVistaDetalle(false);
    } catch (e) {
      console.error("Error al eliminar servicio:", e);
      alert("Error al eliminar el servicio.");
    } finally {
      setIsDeleting(false);
      cerrarEliminar();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[var(--color-primary)] text-lg font-semibold">
        Cargando servicios...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <h1 className="heading-1 text-[var(--color-primary)] mb-2">Servicios</h1>
      <p className="body-1 text-[var(--color-gray)] mb-6">
        Gestión de servicios ejecutados y activos
      </p>

      <ButtonList
        buttons={[
          {
            id: "add",
            name: "Añadir Servicio",
            icon: "/icons/add.svg",
            coordinate: 4,
            action: abrirFormulario,
          },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4 mb-6">
        <input
          type="text"
          placeholder="Buscar servicio por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      <ServiciosCard
        servicios={serviciosFiltrados}
        onEdit={editarServicio}
        onDelete={abrirEliminar}
        onVerDetalles={abrirDetalles}
      />

      {vistaDetalle && servicioSeleccionado && (
        <ServiciosDetails
          servicio={servicioSeleccionado}
          onClose={cerrarDetalles}
          onEdit={editarServicio}
          onDelete={abrirEliminar}
        />
      )}

      {mostrarFormulario && (
        <ServiciosForm
          onSubmit={guardarServicio}
          onClose={cerrarFormulario}
          initialData={servicioAEditar}
          isEdit={modoEdicion}
        />
      )}

      {mostrarEliminar && (
        <DeleteConfirmationModal
          isOpen={mostrarEliminar}
          onClose={cerrarEliminar}
          onConfirm={eliminarServicio}
          itemName={servicioAEliminar?.nombreServicio || ""}
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default ServiciosPage;
