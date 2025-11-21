import React, { useEffect, useState } from "react";

const MenuForm = ({ onSubmit, onClose, initialData = null, isEdit = false, menus = [] }) => {
  const [form, setForm] = useState({
    nombre: "",
    url: "",
    parentId: "",
    es_submenu: false,
    estado: true,
    show: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        nombre: initialData.nombre ?? "",
        url: initialData.url ?? "",
        parentId: initialData.parentId ?? "",
        es_submenu: Boolean(initialData.esSubmenu),
        estado: Boolean(initialData.estado),
        show: Boolean(initialData.show),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-200 overflow-y-auto max-h-[100vh]"
      >
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">
          {isEdit ? "Actualizar Menú" : "Nuevo Menú"}
        </h2>

        {/* === Nombre & URL === */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">Ruta / URL</label>
            <input
              type="text"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="/ruta-ejemplo"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* === Menú principal === */}
        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-1">Menú Principal</label>

          <select
        name="parentId"
        value={form.parentId}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
        >
        <option value="">-- Sin Menú --</option>

        {menus
            // 1️⃣ Solo menús principales reales
            .filter((m) => m.esSubmenu === false)
            .filter((m) => m.parentId === null)
            .filter((m) => m.estado === true)
            .filter((m) => m.show === true)

            // 2️⃣ Evitar ser padre de sí mismo al editar
            .filter((m) => m.id !== initialData?.id)

            .map((m) => (
            <option key={m.id} value={m.id}>
                {m.nombre}
            </option>
            ))}
        </select>

        </div>

        {/* === Submenú + Activar === */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="es_submenu"
              checked={form.es_submenu}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="text-gray-900 font-medium">Submenú</label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="estado"
              checked={form.estado}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="text-gray-900 font-medium">Activar</label>
          </div>
        </div>

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

export default MenuForm;
