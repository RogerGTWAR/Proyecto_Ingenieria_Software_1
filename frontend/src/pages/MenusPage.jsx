import { useState } from "react";
import ButtonList from "../components/ButtonList";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";
import Modal from "../components/Modal";

import { useMenus } from "../hooks/useMenus";
import MenusForm from "../components/menus/MenusForm";
import MenusTable from "../components/menus/MenusTable";

export default function MenusPage() {
  const { items: menus, loading, add, edit, remove, reload } = useMenus();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [menuAEliminar, setMenuAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const buttons = [
    {
      id: "add",
      name: "Añadir",
      icon: "/icons/add.svg",
      coordinate: 4,
      action: () => {
        setSelectedItem(null);
        setIsEdit(false);
        setIsModalOpen(true);
      },
    },
  ];

  const handleSubmit = async (formData) => {
    if (isEdit) {
      await edit(formData.id, formData);
    } else {
      await add(formData);
    }
    setIsModalOpen(false);
    reload();
  };

  const abrirEliminar = (menu) => {
    setMenuAEliminar(menu);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setMenuAEliminar(null);
  };

  const eliminarMenu = async () => {
    if (!menuAEliminar) return;
    setIsDeleting(true);
    try {
      await remove(menuAEliminar.id);
      await reload();
      cerrarEliminar();
    } catch (e) {
      console.error("Error al eliminar menú:", e);
      alert("No se pudo eliminar el menú.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <h1 className="heading-1 text-[var(--color-primary)] mb-2">
          Gestión de Menús
        </h1>
        <p className="body-1 text-[var(--color-gray)] mb-4">
          Administra menús, submenús y sus rutas
        </p>

        <ButtonList buttons={buttons} />

        {loading ? (
          <p className="text-gray-600 mt-4">Cargando menús...</p>
        ) : (
          <MenusTable
            menus={menus}
            onEdit={(m) => {
              setSelectedItem(m);
              setIsEdit(true);
              setIsModalOpen(true);
            }}
            onDelete={(m) => abrirEliminar(m)}  
          />
        )}

        {isModalOpen && (
          <MenusForm
            initialData={selectedItem}
            isEdit={isEdit}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            menus={menus}
          />
        )}

        {mostrarEliminar && (
          <DeleteConfirmationModal
            isOpen={mostrarEliminar}
            onClose={cerrarEliminar}
            onConfirm={eliminarMenu}
            itemName={menuAEliminar?.nombre || ""}
            loading={isDeleting}
          />
        )}
      </main>
    </div>
  );
}
