import React, { useEffect, useState } from "react";
import { useCategorias } from "../../hooks/useCategorias";

const MaterialesForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: categorias } = useCategorias();

  const [form, setForm] = useState({
    categoria_id: "",
    nombre_material: "",
    descripcion: "",
    unidad_de_medida: "",
    cantidad_en_stock: "",
    precio_unitario: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        categoria_id: initialData.categoria_id ?? "",
        nombre_material: initialData.nombre_material ?? "",
        descripcion: initialData.descripcion ?? "",
        unidad_de_medida: initialData.unidad_de_medida ?? "",
        cantidad_en_stock: String(initialData.cantidad_en_stock ?? ""),
        precio_unitario: String(initialData.precio_unitario ?? ""),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.categoria_id) newErrors.categoria_id = "Seleccione una categoría.";

    if (!form.nombre_material.trim())
      newErrors.nombre_material = "El nombre es obligatorio.";

    if (!form.unidad_de_medida.trim())
      newErrors.unidad_de_medida = "Debe ingresar una unidad de medida.";

    if (!form.cantidad_en_stock)
      newErrors.cantidad_en_stock = "Debe ingresar la cantidad.";
    else if (Number(form.cantidad_en_stock) < 0)
      newErrors.cantidad_en_stock = "La cantidad no puede ser negativa.";

    if (!form.precio_unitario)
      newErrors.precio_unitario = "Debe ingresar el precio.";
    else if (Number(form.precio_unitario) <= 0)
      newErrors.precio_unitario = "El precio debe ser mayor a 0.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
        className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-200 overflow-y-auto max-h-[100vh]"
      >
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">
          {isEdit ? "Editar Material" : "Nuevo Material"}
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">Categoría</label>
            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre_categoria}
                </option>
              ))}
            </select>
            {errors.categoria_id && (
              <p className="text-red-600 text-sm">{errors.categoria_id}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Nombre del Material
            </label>
            <input
              type="text"
              name="nombre_material"
              value={form.nombre_material}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {errors.nombre_material && (
              <p className="text-red-600 text-sm">{errors.nombre_material}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Unidad de Medida
            </label>
            <input
              type="text"
              name="unidad_de_medida"
              value={form.unidad_de_medida}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {errors.unidad_de_medida && (
              <p className="text-red-600 text-sm">{errors.unidad_de_medida}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Cantidad en Stock
            </label>
            <input
              type="number"
              name="cantidad_en_stock"
              value={form.cantidad_en_stock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {errors.cantidad_en_stock && (
              <p className="text-red-600 text-sm">{errors.cantidad_en_stock}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-1">
            Precio Unitario (C$)
          </label>
          <input
            type="number"
            step="0.01"
            name="precio_unitario"
            value={form.precio_unitario}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.precio_unitario && (
            <p className="text-red-600 text-sm">{errors.precio_unitario}</p>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-gray-900 font-medium mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          ></textarea>
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button
            type="submit"
            className="text-white text-base font-medium px-7 py-3 rounded-md"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            {isEdit ? "Actualizar" : "Guardar"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-900 text-base font-medium px-7 py-3 rounded-md"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialesForm;
