import { useState } from "react";
import ButtonList from "../components/ButtonList";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";
import ProyectosCard from "../components/proyectos/ProyectosCard";
import ProyectosDetails from "../components/proyectos/ProyectosDetails";
import ProyectosForm from "../components/proyectos/ProyectosForm";
import { useProyectos } from "../hooks/useProyectos";
import { useDetallesEmpleados } from "../hooks/useDetallesEmpleados";
import ProyectosTable from "../components/proyectos/ProyectosTable";

function ProyectosPage() {
  const { items: proyectos, loading, add, edit, remove, reload } = useProyectos();
  const { reload: reloadDetalles } = useDetallesEmpleados();

  const [busqueda, setBusqueda] = useState("");
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [proyectoAEditar, setProyectoAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [proyectoAEliminar, setProyectoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔘 NUEVO: control de vista (true = tarjetas, false = tabla)
  const [vistaTarjetas, setVistaTarjetas] = useState(true);

  const proyectosFiltrados = (proyectos || []).filter((p) =>
    p.nombreProyecto?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormulario = () => {
    setProyectoAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarProyecto = (proyecto) => {
    setProyectoAEditar(proyecto);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setVistaDetalle(false);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProyectoAEditar(null);
    setModoEdicion(false);
  };

  const guardarProyecto = async (data) => {
    try {
      let proyectoGuardado;

      if (modoEdicion && proyectoAEditar) {
        proyectoGuardado = await edit(proyectoAEditar.id, data);
        setProyectoSeleccionado(proyectoGuardado);
      } else {
        proyectoGuardado = await add(data);
      }

      if (!proyectoGuardado || !proyectoGuardado.id) {
        console.error("❌ No se pudo obtener el ID del proyecto:", proyectoGuardado);
        alert("No se pudo obtener el ID del proyecto guardado.");
        return null;
      }

      await reload();
      await reloadDetalles();
      return proyectoGuardado;
    } catch (error) {
      console.error("❌ Error al guardar proyecto:", error);
      alert("No se pudo guardar el proyecto.");
      return null;
    }
  };

  const verDetalles = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setProyectoSeleccionado(null);
  };

  const abrirEliminar = (proyecto) => {
    setProyectoAEliminar(proyecto);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setProyectoAEliminar(null);
  };

  const eliminarProyecto = async () => {
    if (!proyectoAEliminar) return;
    setIsDeleting(true);
    try {
      await remove(proyectoAEliminar.id);
      await reload();
      setVistaDetalle(false);
    } catch (e) {
      console.error("Error al eliminar proyecto:", e);
      alert("Error al eliminar el proyecto.");
    } finally {
      setIsDeleting(false);
      cerrarEliminar();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[var(--color-primary)] text-lg font-semibold">
        Cargando proyectos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <h1 className="heading-1 text-[var(--color-primary)] mb-2">Proyectos</h1>
      <p className="body-1 text-[var(--color-gray)] mb-6">
        Gestión de proyectos y avances
      </p>

      <ButtonList
        buttons={[
          {
            id: "add",
            name: "Añadir Proyecto",
            icon: "/icons/add.svg",
            coordinate: 4,
            action: abrirFormulario,
          },
        ]}
      />

      {/* 🔎 Buscador */}
      <div className="bg-white rounded-xl shadow-sm p-4 mt-4 mb-4 flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Buscar proyecto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
        />

        {/* 🔘 Switch Tabla / Tarjetas */}
        <button
          onClick={() => setVistaTarjetas(!vistaTarjetas)}
          className="px-4 py-2 bg-[#1A2E81] text-white rounded-lg shadow hover:scale-105 transition"
        >
          {vistaTarjetas ? "Ver como Tabla" : "Ver como Tarjetas"}
        </button>
      </div>

      {/* 📋 / 🧊 Contenido según la vista */}
      {vistaTarjetas ? (
        <ProyectosCard
          proyectos={proyectosFiltrados}
          onEdit={editarProyecto}
          onDelete={abrirEliminar}
          onVerDetalles={verDetalles}
        />
      ) : (
        <ProyectosTable
          proyectos={proyectosFiltrados}
          onEdit={editarProyecto}
          onDelete={abrirEliminar}
          onVerDetalles={verDetalles}
        />
      )}

      {vistaDetalle && proyectoSeleccionado && (
        <ProyectosDetails
          proyecto={proyectoSeleccionado}
          onClose={cerrarDetalles}
          onEdit={editarProyecto}
          onDelete={abrirEliminar}
        />
      )}

      {mostrarFormulario && (
        <ProyectosForm
          onSubmit={guardarProyecto}
          onClose={cerrarFormulario}
          initialData={proyectoAEditar}
          isEdit={modoEdicion}
        />
      )}

      {mostrarEliminar && (
        <DeleteConfirmationModal
          isOpen={mostrarEliminar}
          onClose={cerrarEliminar}
          onConfirm={eliminarProyecto}
          itemName={proyectoAEliminar?.nombreProyecto || ""}
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default ProyectosPage;
