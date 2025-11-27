import { useState } from "react";
import ButtonList from "../components/ButtonList";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import ComprasCard from "../components/compras/ComprasCard";
import ComprasTable from "../components/compras/ComprasTable";
import ComprasDetails from "../components/compras/ComprasDetails";
import ComprasForm from "../components/compras/ComprasForm";

import { useCompras } from "../hooks/useCompras";
import { useDetallesCompras } from "../hooks/useDetallesCompras";

function ComprasPage() {
  const {
    items: compras,
    loading,
    add,
    edit,
    remove,
    reload,
  } = useCompras();

  const { reload: reloadDetalles } = useDetallesCompras();

  const [busqueda, setBusqueda] = useState("");

  const [vistaTarjetas, setVistaTarjetas] = useState(true);

  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [compraAEditar, setCompraAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [compraAEliminar, setCompraAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const comprasFiltradas = (compras || []).filter((c) => {
    const txt = busqueda.toLowerCase();
    return (
      c.numero_factura?.toLowerCase().includes(txt) ||
      c.proveedorNombre?.toLowerCase().includes(txt) ||
      c.estado?.toLowerCase().includes(txt)
    );
  });

  const abrirFormulario = () => {
    setCompraAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarCompra = (compra) => {
    setCompraAEditar(compra);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setVistaDetalle(false); 
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setCompraAEditar(null);
    setModoEdicion(false);
  };

  const guardarCompra = async (data) => {
    try {
      let compraGuardada;

      if (modoEdicion && compraAEditar) {
        compraGuardada = await edit(compraAEditar.id, data);
        setCompraSeleccionada(compraGuardada);
      } else {
        compraGuardada = await add(data);
      }

      if (!compraGuardada?.id) {
        alert("No se pudo obtener el ID de la compra guardada.");
        return null;
      }

      await reload();
      await reloadDetalles();
      return compraGuardada;
    } catch (error) {
      alert("Error al guardar la compra.");
      return null;
    }
  };

  const verDetalles = (compra) => {
    setCompraSeleccionada(compra);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setCompraSeleccionada(null);
  };

  const abrirEliminar = (compra) => {
    setCompraAEliminar(compra);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setCompraAEliminar(null);
  };

  const eliminarCompra = async () => {
    if (!compraAEliminar) return;

    setIsDeleting(true);
    try {
      await remove(compraAEliminar.id);
      await reload();
      await reloadDetalles();
      setVistaDetalle(false);
    } finally {
      setIsDeleting(false);
      cerrarEliminar();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[var(--color-primary)] text-lg font-semibold">
        Cargando compras...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <h1 className="heading-1 text-[var(--color-primary)] mb-2">Compras</h1>
      <p className="body-1 text-[var(--color-gray)] mb-6">
        Gestión y control de compras de materiales
      </p>

      <ButtonList
        buttons={[
          {
            id: "add",
            name: "Registrar Compra",
            icon: "/icons/add.svg",
            coordinate: 4,
            action: abrirFormulario,
          },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4 mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por Nº factura, proveedor o estado..."
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
        <ComprasCard
          compras={comprasFiltradas}
          onEdit={editarCompra}
          onDelete={abrirEliminar}
          onVerDetalles={verDetalles}
        />
      ) : (
        <ComprasTable
          compras={comprasFiltradas}
          onEdit={editarCompra}
          onDelete={abrirEliminar}
          onVerDetalles={verDetalles}
        />
      )}

      {vistaDetalle && compraSeleccionada && (
        <ComprasDetails
          compra={compraSeleccionada}
          onClose={cerrarDetalles}
          onEdit={editarCompra}
          onDelete={abrirEliminar}
        />
      )}

      {mostrarFormulario && (
        <ComprasForm
          onSubmit={guardarCompra}
          onClose={cerrarFormulario}
          initialData={compraAEditar}
          isEdit={modoEdicion}
        />
      )}

      {mostrarEliminar && (
        <DeleteConfirmationModal
          isOpen={mostrarEliminar}
          onClose={cerrarEliminar}
          onConfirm={eliminarCompra}
          itemName={compraAEliminar?.numero_factura || ""}
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default ComprasPage;
