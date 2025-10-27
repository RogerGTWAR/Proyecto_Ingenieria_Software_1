import React, { useEffect, useState } from "react";
import { useCategorias } from "../../hooks/useCategorias";

const ProductosForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: categorias } = useCategorias();

  const [form, setForm] = useState({
    categoria_id: "",
    nombre_producto: "",
    descripcion: "",
    unidad_de_medida: "",
    cantidad_en_stock: "",
    precio_unitario: "",
  });

  // ✅ Cargar datos del producto al editar
  useEffect(() => {
    if (initialData) {
      setForm({
        categoria_id: initialData.categoria_id ?? "",
        nombre_producto: initialData.nombre_producto ?? "",
        descripcion: initialData.descripcion ?? "",
        unidad_de_medida: initialData.unidad_de_medida ?? "",
        cantidad_en_stock: String(initialData.cantidad_en_stock ?? ""),
        precio_unitario: String(initialData.precio_unitario ?? ""),
      });
    }
  }, [initialData]);

  // ✅ Actualizar formulario al escribir
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Enviar datos
  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedData = {
      ...form,
      cantidad_en_stock: Number(form.cantidad_en_stock),
      precio_unitario: Number(form.precio_unitario),
    };
    await onSubmit(parsedData);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-200 overflow-y-auto max-h-[100vh]"
      >
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">
          {isEdit ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        {/* === Categoría y Nombre === */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">Categoría</label>
            <select
              name="categoria_id"
              value={form.categoria_id}
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
            <label className="block text-gray-900 font-medium mb-1">Nombre del Producto</label>
            <input
              type="text"
              name="nombre_producto"
              value={form.nombre_producto}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* === Unidad y Cantidad === */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">Unidad de Medida</label>
            <input
              type="text"
              name="unidad_de_medida"
              value={form.unidad_de_medida}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">Cantidad en Stock</label>
            <input
              type="number"
              name="cantidad_en_stock"
              value={form.cantidad_en_stock}
              onChange={handleChange}
              min="0"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* === Precio === */}
        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-1">Precio Unitario (C$)</label>
          <input
            type="number"
            step="0.01"
            name="precio_unitario"
            value={form.precio_unitario}
            onChange={handleChange}
            min="0"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* === Descripción === */}
        <div className="mb-8">
          <label className="block text-gray-900 font-medium mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
          ></textarea>
        </div>

        {/* 🔘 Botones */}
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

export default ProductosForm;
