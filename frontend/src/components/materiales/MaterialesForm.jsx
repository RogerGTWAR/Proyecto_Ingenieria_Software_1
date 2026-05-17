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
    } else {
      setForm({
        categoria_id: "",
        nombre_material: "",
        descripcion: "",
        unidad_de_medida: "",
        cantidad_en_stock: "",
        precio_unitario: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.categoria_id) {
      newErrors.categoria_id = "Seleccione una categoría.";
    }

    if (!form.nombre_material.trim()) {
      newErrors.nombre_material = "El nombre es obligatorio.";
    }

    if (!form.unidad_de_medida.trim()) {
      newErrors.unidad_de_medida = "Debe ingresar una unidad de medida.";
    }

    if (!form.cantidad_en_stock) {
      newErrors.cantidad_en_stock = "Debe ingresar la cantidad.";
    } else if (Number(form.cantidad_en_stock) < 0) {
      newErrors.cantidad_en_stock = "La cantidad no puede ser negativa.";
    }

    if (!form.precio_unitario) {
      newErrors.precio_unitario = "Debe ingresar el precio.";
    } else if (Number(form.precio_unitario) <= 0) {
      newErrors.precio_unitario = "El precio debe ser mayor a 0.";
    }

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

  const stock = Number(form.cantidad_en_stock || 0);
  const precio = Number(form.precio_unitario || 0);
  const valorInventario = stock * precio;

  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-300 bg-slate-100 px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  const errorClass = "mt-1 text-sm font-medium text-red-600";

  return (
    <div
      className="
        fixed
        left-0
        right-0
        bottom-0
        top-16
        z-40
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-slate-900/35
        px-4
        py-6
        lg:left-48
      "
    >
      <form
        onSubmit={handleSubmit}
        className="
          flex
          w-full
          max-w-5xl
          max-h-[calc(100dvh-96px)]
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-slate-300
          bg-slate-100
          shadow-2xl
        "
      >
        <div
          className="
            shrink-0
            bg-gradient-to-r
            from-slate-950
            via-blue-950
            to-cyan-900
            px-5
            py-5
            text-white
            shadow-lg
            sm:px-7
          "
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-cyan-100">
                Gestión de materiales
              </p>

              <h2 className="truncate text-sm font-bold tracking-tight text-white">
                {isEdit ? "Editar Material" : "Nuevo Material"}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur sm:text-right">
                <p className="text-sm font-medium text-cyan-100">Stock</p>

                <p className="truncate text-sm font-bold text-white">
                  {stock.toLocaleString("es-NI")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur sm:text-right">
                <p className="text-sm font-medium text-cyan-100">Precio</p>

                <p className="truncate text-sm font-bold text-white">
                  C${money(precio)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur sm:text-right">
                <p className="text-sm font-medium text-cyan-100">
                  Valor total
                </p>

                <p className="truncate text-sm font-bold text-white">
                  C${money(valorInventario)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información del material
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Complete los datos principales del material.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
              <div className="min-w-0">
                <label className={labelClass}>Categoría</label>

                <select
                  name="categoria_id"
                  value={form.categoria_id}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Seleccione una categoría</option>

                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre_categoria}
                    </option>
                  ))}
                </select>

                {errors.categoria_id && (
                  <p className={errorClass}>{errors.categoria_id}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Nombre del Material</label>

                <input
                  type="text"
                  name="nombre_material"
                  value={form.nombre_material}
                  onChange={handleChange}
                  placeholder="Ejemplo: Cemento Portland"
                  className={inputClass}
                />

                {errors.nombre_material && (
                  <p className={errorClass}>{errors.nombre_material}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Unidad de Medida</label>

                <input
                  type="text"
                  name="unidad_de_medida"
                  value={form.unidad_de_medida}
                  onChange={handleChange}
                  placeholder="Ejemplo: bolsa, m³, unidad"
                  className={inputClass}
                />

                {errors.unidad_de_medida && (
                  <p className={errorClass}>{errors.unidad_de_medida}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Cantidad en Stock</label>

                <input
                  type="number"
                  name="cantidad_en_stock"
                  value={form.cantidad_en_stock}
                  onChange={handleChange}
                  placeholder="Ejemplo: 100"
                  className={inputClass}
                />

                {errors.cantidad_en_stock && (
                  <p className={errorClass}>{errors.cantidad_en_stock}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Precio Unitario (C$)</label>

                <input
                  type="number"
                  step="0.01"
                  name="precio_unitario"
                  value={form.precio_unitario}
                  onChange={handleChange}
                  placeholder="Ejemplo: 350.00"
                  className={inputClass}
                />

                {errors.precio_unitario && (
                  <p className={errorClass}>{errors.precio_unitario}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Valor en Inventario</label>

                <div
                  className="
                    flex
                    min-h-[46px]
                    items-center
                    rounded-xl
                    border
                    border-emerald-300
                    bg-emerald-100
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-emerald-800
                    shadow-sm
                  "
                >
                  C${money(valorInventario)}
                </div>
              </div>

              <div className="min-w-0 md:col-span-2">
                <label className={labelClass}>Descripción</label>

                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Descripción breve del material"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-blue-200 bg-blue-100 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  Categorías disponibles
                </p>

                <p className="mt-1 text-sm font-bold text-blue-900">
                  {categorias.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-600">
                  Cantidad registrada
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {stock.toLocaleString("es-NI")}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-100 p-4">
                <p className="text-sm font-semibold text-emerald-700">
                  Valor estimado
                </p>

                <p className="mt-1 text-sm font-bold text-emerald-900">
                  C${money(valorInventario)}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-slate-300 bg-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="
                w-full
                rounded-2xl
                border
                border-slate-400
                bg-slate-100
                px-8
                py-3
                text-sm
                font-bold
                text-slate-800
                shadow-sm
                transition
                hover:bg-slate-300
                sm:w-auto
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="
                w-full
                rounded-2xl
                bg-gradient-to-r
                from-blue-800
                to-cyan-700
                px-8
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                transition
                hover:scale-[1.01]
                hover:shadow-xl
                sm:w-auto
              "
            >
              {isEdit ? "Actualizar Material" : "Guardar Material"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MaterialesForm;