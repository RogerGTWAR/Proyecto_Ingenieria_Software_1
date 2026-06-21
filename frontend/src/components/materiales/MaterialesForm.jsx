import { useEffect, useState } from "react";
import { useCategorias } from "../../hooks/useCategorias";

const MaterialesForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: categorias } = useCategorias();

  const [form, setForm] = useState({
    categoria_id: "",
    nombre_material: "",
    descripcion: "",
    unidad_de_medida: "",
    cantidad_en_stock: "",
    stock_minimo: "10",
    precio_unitario: "",
  });

  const [errors, setErrors] = useState({});
  const [guardando, setGuardando] = useState(false);

  const [modalMensaje, setModalMensaje] = useState({
    open: false,
    type: "error",
    title: "",
    message: "",
  });

  const mostrarMensaje = (type, title, message) => {
    setModalMensaje({
      open: true,
      type,
      title,
      message,
    });
  };

  const cerrarMensaje = () => {
    setModalMensaje({
      open: false,
      type: "error",
      title: "",
      message: "",
    });
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        categoria_id: initialData.categoria_id ?? "",
        nombre_material: initialData.nombre_material ?? "",
        descripcion: initialData.descripcion ?? "",
        unidad_de_medida: initialData.unidad_de_medida ?? "",
        cantidad_en_stock: String(initialData.cantidad_en_stock ?? ""),
        stock_minimo: String(initialData.stock_minimo ?? 10),
        precio_unitario: String(initialData.precio_unitario ?? ""),
      });
    } else {
      setForm({
        categoria_id: "",
        nombre_material: "",
        descripcion: "",
        unidad_de_medida: "",
        cantidad_en_stock: "",
        stock_minimo: "10",
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

    const cantidad = Number(form.cantidad_en_stock);
    const stockMinimo = Number(form.stock_minimo);
    const precio = Number(form.precio_unitario);

    if (!form.categoria_id) {
      newErrors.categoria_id = "Seleccione una categoría.";
    }

    if (!form.nombre_material.trim()) {
      newErrors.nombre_material = "El nombre es obligatorio.";
    } else if (form.nombre_material.trim().length < 3) {
      newErrors.nombre_material =
        "El nombre del material debe tener al menos 3 caracteres.";
    }

    if (!form.unidad_de_medida.trim()) {
      newErrors.unidad_de_medida = "Debe ingresar una unidad de medida.";
    }

    if (form.cantidad_en_stock === "") {
      newErrors.cantidad_en_stock = "Debe ingresar la cantidad.";
    } else if (Number.isNaN(cantidad)) {
      newErrors.cantidad_en_stock = "La cantidad debe ser numérica.";
    } else if (cantidad < 0) {
      newErrors.cantidad_en_stock = "La cantidad no puede ser negativa.";
    }

    if (form.stock_minimo === "") {
      newErrors.stock_minimo = "Debe ingresar el stock mínimo.";
    } else if (Number.isNaN(stockMinimo)) {
      newErrors.stock_minimo = "El stock mínimo debe ser numérico.";
    } else if (stockMinimo < 10) {
      newErrors.stock_minimo = "El stock mínimo no puede ser menor a 10.";
    }

    if (
      form.cantidad_en_stock !== "" &&
      form.stock_minimo !== "" &&
      !Number.isNaN(cantidad) &&
      !Number.isNaN(stockMinimo) &&
      cantidad < stockMinimo
    ) {
      newErrors.cantidad_en_stock =
        "La cantidad en stock no puede ser menor al stock mínimo.";
    }

    if (form.precio_unitario === "") {
      newErrors.precio_unitario = "Debe ingresar el precio.";
    } else if (Number.isNaN(precio)) {
      newErrors.precio_unitario = "El precio debe ser numérico.";
    } else if (precio <= 0) {
      newErrors.precio_unitario = "El precio debe ser mayor a 0.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (guardando) return;

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      mostrarMensaje(
        "error",
        "Revise los datos del material",
        "Hay campos pendientes o valores inválidos. Revise el formulario antes de guardar."
      );

      return;
    }

    const parsedData = {
      categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
      nombre_material: form.nombre_material.trim(),
      descripcion: form.descripcion.trim(),
      unidad_de_medida: form.unidad_de_medida.trim(),
      cantidad_en_stock: Number(form.cantidad_en_stock),
      stock_minimo: Number(form.stock_minimo),
      precio_unitario: Number(form.precio_unitario),
    };

    try {
      setGuardando(true);

      const saved = await onSubmit(parsedData);

      if (!saved) {
        return;
      }
    } finally {
      setGuardando(false);
    }
  };

  const stock = Number(form.cantidad_en_stock || 0);
  const stockMinimo = Number(form.stock_minimo || 10);
  const precio = Number(form.precio_unitario || 0);
  const valorInventario = stock * precio;
  const stockBajo = stock <= stockMinimo;

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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <HeaderBox label="Stock" value={stock.toLocaleString("es-NI")} />

              <HeaderBox
                label="Mínimo"
                value={stockMinimo.toLocaleString("es-NI")}
              />

              <HeaderBox label="Precio" value={`C$${money(precio)}`} />

              <HeaderBox
                label="Valor total"
                value={`C$${money(valorInventario)}`}
              />
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
                  disabled={guardando}
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
                  disabled={guardando}
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
                  disabled={guardando}
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
                  disabled={guardando}
                  min="0"
                  step="0.01"
                  placeholder="Ejemplo: 100"
                  className={inputClass}
                />

                {errors.cantidad_en_stock && (
                  <p className={errorClass}>{errors.cantidad_en_stock}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Stock Mínimo</label>

                <input
                  type="number"
                  name="stock_minimo"
                  value={form.stock_minimo}
                  onChange={handleChange}
                  disabled={guardando}
                  min="10"
                  step="0.01"
                  placeholder="Mínimo permitido: 10"
                  className={inputClass}
                />

                {errors.stock_minimo && (
                  <p className={errorClass}>{errors.stock_minimo}</p>
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
                  disabled={guardando}
                  min="0"
                  placeholder="Ejemplo: 350.00"
                  className={inputClass}
                />

                {errors.precio_unitario && (
                  <p className={errorClass}>{errors.precio_unitario}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Estado del Stock</label>

                <div
                  className={`
                    flex
                    min-h-[46px]
                    items-center
                    rounded-xl
                    border
                    px-4
                    py-3
                    text-sm
                    font-bold
                    shadow-sm
                    ${
                      stockBajo
                        ? "border-red-300 bg-red-100 text-red-800"
                        : "border-blue-300 bg-blue-100 text-blue-800"
                    }
                  `}
                >
                  {stockBajo
                    ? "Stock bajo o en mínimo"
                    : "Stock disponible correctamente"}
                </div>
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
                  disabled={guardando}
                  rows={3}
                  placeholder="Descripción breve del material"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <SummaryBox
                label="Categorías disponibles"
                value={categorias.length}
                variant="blue"
              />

              <SummaryBox
                label="Cantidad registrada"
                value={stock.toLocaleString("es-NI")}
              />

              <SummaryBox
                label="Stock mínimo"
                value={stockMinimo.toLocaleString("es-NI")}
                variant="yellow"
              />

              <SummaryBox
                label="Valor estimado"
                value={`C$${money(valorInventario)}`}
                variant="green"
              />
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-slate-300 bg-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
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
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-auto
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
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
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:scale-100
                sm:w-auto
              "
            >
              {guardando
                ? "Guardando..."
                : isEdit
                ? "Actualizar Material"
                : "Guardar Material"}
            </button>
          </div>
        </div>
      </form>

      {modalMensaje.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div
            className={`
              w-full max-w-md overflow-hidden rounded-3xl border bg-white shadow-2xl
              ${
                modalMensaje.type === "error"
                  ? "border-red-200"
                  : "border-emerald-200"
              }
            `}
          >
            <div className="px-6 py-6">
              <div className="flex items-start gap-4">
                <div
                  className={`
                    flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black
                    ${
                      modalMensaje.type === "error"
                        ? "bg-red-100 text-red-600"
                        : "bg-emerald-100 text-emerald-600"
                    }
                  `}
                >
                  {modalMensaje.type === "error" ? "!" : "✓"}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black text-slate-900">
                    {modalMensaje.title}
                  </h3>

                  <p className="mt-2 whitespace-pre-line text-sm font-medium leading-relaxed text-slate-600">
                    {modalMensaje.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={cerrarMensaje}
                className={`
                  rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition
                  ${
                    modalMensaje.type === "error"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }
                `}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HeaderBox = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur sm:text-right">
    <p className="text-sm font-medium text-cyan-100">{label}</p>

    <p className="truncate text-sm font-bold text-white">{value}</p>
  </div>
);

const SummaryBox = ({ label, value, variant = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-100 text-slate-800",
    blue: "border-blue-200 bg-blue-100 text-blue-900",
    yellow: "border-amber-200 bg-amber-100 text-amber-900",
    green: "border-emerald-200 bg-emerald-100 text-emerald-900",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>

      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};

export default MaterialesForm;