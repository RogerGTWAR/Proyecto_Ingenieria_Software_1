import { useState } from "react";

import ButtonList from "../components/ButtonList";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import AvaluosCard from "../components/avaluos/AvaluosCard";
import AvaluosTable from "../components/avaluos/AvaluosTable";
import AvaluosDetails from "../components/avaluos/AvaluosDetails";
import AvaluosForm from "../components/avaluos/AvaluosForm";

import { useAvaluos } from "../hooks/useAvaluos";
import { useDetallesAvaluos } from "../hooks/useDetallesAvaluos";
import { useServicios } from "../hooks/useServicios";  

function AvaluosPage() {
  const {
    items: avaluos,
    loading,
    add,
    edit,
    remove,
    reload,
  } = useAvaluos();

  const { reload: reloadDetalles } = useDetallesAvaluos();

  const { items: servicios, reload: reloadServicios } = useServicios();

  const [busqueda, setBusqueda] = useState("");

  const [vistaTarjetas, setVistaTarjetas] = useState(true);

  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [avaluoSeleccionado, setAvaluoSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [avaluoAEditar, setAvaluoAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [avaluoAEliminar, setAvaluoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const avaluosFiltrados = (avaluos || []).filter((a) =>
    a.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormulario = () => {
    setAvaluoAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarAvaluo = (avaluo) => {
    setAvaluoAEditar(avaluo);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setVistaDetalle(false);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setAvaluoAEditar(null);
    setModoEdicion(false);
  };

  const guardarAvaluo = async (data) => {
    try {
      let avaluoGuardado;

      if (modoEdicion && avaluoAEditar) {
        avaluoGuardado = await edit(avaluoAEditar.id, data);
        setAvaluoSeleccionado(avaluoGuardado);
      } else {
        avaluoGuardado = await add(data);
      }

      if (!avaluoGuardado || !avaluoGuardado.id) {
        alert("No se pudo obtener el ID del avalúo guardado.");
        return null;
      }

      await reloadServicios();
      await reload();
      await reloadDetalles();

      return avaluoGuardado;
    } catch (error) {
      console.error("Error al guardar avalúo:", error);
      alert("No se pudo guardar el avalúo.");
      return null;
    }
  };

  const verDetalles = (avaluo) => {
    setAvaluoSeleccionado(avaluo);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setAvaluoSeleccionado(null);
  };

  const abrirEliminar = (avaluo) => {
    setAvaluoAEliminar(avaluo);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setAvaluoAEliminar(null);
  };

  const eliminarAvaluo = async () => {
    if (!avaluoAEliminar) return;

    setIsDeleting(true);
    try {
      await remove(avaluoAEliminar.id);
      await reload();
    } catch (e) {
      console.error("Error al eliminar avalúo:", e);
      alert("Error al eliminar el avalúo.");
    } finally {
      setIsDeleting(false);
      cerrarEliminar();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[var(--color-primary)] text-lg font-semibold">
        Cargando avalúos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <h1 className="heading-1 text-[var(--color-primary)] mb-2">Avalúos</h1>
      <p className="body-1 text-[var(--color-gray)] mb-6">
        Gestión de avalúos y detalles de servicios
      </p>

      <ButtonList
        buttons={[
          {
            id: "add",
            name: "Añadir Avalúo",
            icon: "/icons/add.svg",
            coordinate: 4,
            action: abrirFormulario,
          },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4 mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar avalúo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
        />

        <button
          onClick={() => setVistaTarjetas(!vistaTarjetas)}
          className="px-5 py-2 rounded-lg shadow-md text-white font-medium transition bg-[#1A2E81]"
        >
          {vistaTarjetas ? "Vista: Tarjetas" : "Vista: Tabla"}
        </button>
      </div>

      {vistaTarjetas ? (
        <AvaluosCard
          avaluos={avaluosFiltrados}
          onEdit={editarAvaluo}
          onDelete={abrirEliminar}
          onVerDetalles={verDetalles}
        />
      ) : (
        <AvaluosTable
          avaluos={avaluosFiltrados}
          onEdit={editarAvaluo}
          onDelete={abrirEliminar}
          onVerDetalles={verDetalles}
        />
      )}

      {vistaDetalle && avaluoSeleccionado && (
        <AvaluosDetails
          avaluo={avaluoSeleccionado}
          onClose={cerrarDetalles}
          onEdit={editarAvaluo}
          onDelete={abrirEliminar}
        />
      )}

      {mostrarFormulario && (
        <AvaluosForm
          onSubmit={guardarAvaluo}
          onClose={cerrarFormulario}
          initialData={avaluoAEditar}
          isEdit={modoEdicion}

          servicios={servicios}
        />
      )}

      {mostrarEliminar && (
        <DeleteConfirmationModal
          isOpen={mostrarEliminar}
          onClose={cerrarEliminar}
          onConfirm={eliminarAvaluo}
          itemName={avaluoAEliminar?.descripcion || ""}
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default AvaluosPage;
