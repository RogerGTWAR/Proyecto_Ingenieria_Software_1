import { useEffect, useState } from "react";
import { useCategoriasProveedor } from "../../hooks/useCategoriasProveedores";

const ProveedoresForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: categorias } = useCategoriasProveedor();

  const [form, setForm] = useState({
    categoria_proveedor_id: "",
    nombre_empresa: "",
    nombre_contacto: "",
    cargo_contacto: "",
    direccion: "",
    ciudad: "",
    pais: "",
    telefono: "",
    correo: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-200 overflow-y-auto max-h-[100vh]"
      >
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">
          {isEdit ? "Editar Proveedor" : "Nuevo Proveedor"}
        </h2>

        {/* === Categoría y Empresa === */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Categoría
            </label>
            <select
              name="categoria_proveedor_id"
              value={form.categoria_proveedor_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre_categoria}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Empresa
            </label>
            <input
              type="text"
              name="nombre_empresa"
              value={form.nombre_empresa}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            />
          </div>
        </div>

        {/* === Contacto === */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Nombre Contacto
            </label>
            <input
              type="text"
              name="nombre_contacto"
              value={form.nombre_contacto}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Cargo Contacto
            </label>
            <input
              type="text"
              name="cargo_contacto"
              value={form.cargo_contacto}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* === Dirección === */}
        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-1">
            Dirección
          </label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* === Ciudad, País y Teléfono === */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Ciudad
            </label>
            <input
              type="text"
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">
              País
            </label>
            <input
              type="text"
              name="pais"
              value={form.pais}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* === Correo === */}
        <div className="mb-8">
          <label className="block text-gray-900 font-medium mb-1">
            Correo
          </label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* 🔘 Botones con estilo uniforme */}
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

export default ProveedoresForm;
