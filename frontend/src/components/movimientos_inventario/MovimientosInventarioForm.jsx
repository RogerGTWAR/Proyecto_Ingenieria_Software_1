import { useState } from "react";
import { useMateriales } from "../../hooks/useMateriales";

const MovimientosInventarioForm = ({ onSubmit, onClose, tipo = "Entrada" }) => {
  const { items: materiales } = useMateriales();

  const [form, setForm] = useState({
    material_id: "",
    tipo_movimiento: tipo,
    cantidad: "",
    stock_nuevo: "",
    precio_unitario: "",
    referencia: "",
    descripcion: "",
    usuario_id: "",
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

  const materialSeleccionado = materiales.find(
    (m) => Number(m.id) === Number(form.material_id)
  );

  const stockActual = Number(materialSeleccionado?.cantidad_en_stock ?? 0);
  const stockMinimo = Number(materialSeleccionado?.stock_minimo ?? 10);
  const precioMaterial = Number(materialSeleccionado?.precio_unitario ?? 0);

  const cantidad = Number(form.cantidad || 0);
  const precio =
    form.precio_unitario !== ""
      ? Number(form.precio_unitario)
      : Number(precioMaterial ?? 0);

  const stockCalculado =
    form.tipo_movimiento === "Entrada"
      ? stockActual + cantidad
      : form.tipo_movimiento === "Salida"
      ? stockActual - cantidad
      : Number(form.stock_nuevo || 0);

  const valorMovimiento =
    form.tipo_movimiento === "Entrada" ? cantidad * precio : 0;

  const money = (value) =>
    Number(value ?? 0).toLocaleString("es-NI", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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

    if (!form.material_id) {
      newErrors.material_id = "Seleccione un material.";
    }

    if (!form.tipo_movimiento) {
      newErrors.tipo_movimiento = "Seleccione el tipo de movimiento.";
    }

    if (form.tipo_movimiento === "Entrada") {
      if (!form.cantidad) {
        newErrors.cantidad = "Ingrese la cantidad.";
      } else if (Number(form.cantidad) <= 0) {
        newErrors.cantidad = "La cantidad debe ser mayor a 0.";
      }

      if (!form.precio_unitario) {
        newErrors.precio_unitario = "Ingrese el precio unitario.";
      } else if (Number(form.precio_unitario) <= 0) {
        newErrors.precio_unitario = "El precio debe ser mayor a 0.";
      }
    }

    if (form.tipo_movimiento === "Salida") {
      if (!form.cantidad) {
        newErrors.cantidad = "Ingrese la cantidad.";
      } else if (Number(form.cantidad) <= 0) {
        newErrors.cantidad = "La cantidad debe ser mayor a 0.";
      } else if (Number(form.cantidad) > stockActual) {
        newErrors.cantidad = "No hay suficiente stock disponible.";
      } else if (stockActual - Number(form.cantidad) < stockMinimo) {
        newErrors.cantidad =
          "La salida dejaría el stock por debajo del mínimo permitido.";
      }
    }

    if (form.tipo_movimiento === "Ajuste") {
      if (form.stock_nuevo === "") {
        newErrors.stock_nuevo = "Ingrese el nuevo stock.";
      } else if (Number(form.stock_nuevo) < 0) {
        newErrors.stock_nuevo = "El nuevo stock no puede ser negativo.";
      } else if (Number(form.stock_nuevo) < stockMinimo) {
        newErrors.stock_nuevo =
          "El nuevo stock no puede ser menor al stock mínimo.";
      }
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
        "Revise los datos del movimiento",
        "Hay campos pendientes o valores inválidos. Revise el formulario antes de guardar."
      );

      return;
    }

    const payload = {
      material_id: Number(form.material_id),
      tipo_movimiento: form.tipo_movimiento,
      cantidad: form.cantidad ? Number(form.cantidad) : undefined,
      stock_nuevo:
        form.stock_nuevo !== "" ? Number(form.stock_nuevo) : undefined,
      precio_unitario:
        form.precio_unitario !== "" ? Number(form.precio_unitario) : undefined,
      referencia: form.referencia,
      descripcion: form.descripcion,
      usuario_id: form.usuario_id ? Number(form.usuario_id) : null,
    };

    try {
      setGuardando(true);

      const saved = await onSubmit(payload);

      if (!saved) {
        return;
      }
    } catch (error) {
      mostrarMensaje(
        "error",
        "Error al registrar movimiento",
        error.message || "No se pudo registrar el movimiento de inventario."
      );
    } finally {
      setGuardando(false);
    }
  };

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-300 bg-slate-100 px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
  const errorClass = "mt-1 text-sm font-medium text-red-600";

  return (
    <div className="fixed left-0 right-0 bottom-0 top-16 z-40 flex items-center justify-center overflow-y-auto bg-slate-900/35 px-4 py-6 lg:left-48">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-5xl max-h-[calc(100dvh-96px)] flex-col overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 shadow-2xl"
      >
        <div className="shrink-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white shadow-lg sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-cyan-100">
                Inventario de materiales
              </p>

              <h2 className="truncate text-sm font-bold tracking-tight text-white">
                Registrar Movimiento
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <HeaderBox label="Stock actual" value={stockActual} />
              <HeaderBox label="Stock mínimo" value={stockMinimo} />
              <HeaderBox label="Stock nuevo" value={stockCalculado} />
              <HeaderBox
                label="Valor"
                value={`C$${money(valorMovimiento)}`}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Datos del movimiento
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Registre una entrada, salida o ajuste de inventario.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
              <div className="min-w-0">
                <label className={labelClass}>Tipo de Movimiento</label>

                <select
                  name="tipo_movimiento"
                  value={form.tipo_movimiento}
                  onChange={handleChange}
                  disabled={guardando}
                  className={inputClass}
                >
                  <option value="Entrada">Entrada</option>
                  <option value="Salida">Salida</option>
                  <option value="Ajuste">Ajuste</option>
                </select>

                {errors.tipo_movimiento && (
                  <p className={errorClass}>{errors.tipo_movimiento}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Material</label>

                <select
                  name="material_id"
                  value={form.material_id}
                  onChange={handleChange}
                  disabled={guardando}
                  className={inputClass}
                >
                  <option value="">Seleccione un material</option>

                  {materiales.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre_material} - Stock:{" "}
                      {Number(m.cantidad_en_stock ?? 0).toLocaleString("es-NI")}
                    </option>
                  ))}
                </select>

                {errors.material_id && (
                  <p className={errorClass}>{errors.material_id}</p>
                )}
              </div>

              {form.tipo_movimiento !== "Ajuste" && (
                <div className="min-w-0">
                  <label className={labelClass}>Cantidad</label>

                  <input
                    type="number"
                    name="cantidad"
                    value={form.cantidad}
                    onChange={handleChange}
                    disabled={guardando}
                    min="1"
                    step="1"
                    placeholder="Ejemplo: 20"
                    className={inputClass}
                  />

                  {errors.cantidad && (
                    <p className={errorClass}>{errors.cantidad}</p>
                  )}
                </div>
              )}

              {form.tipo_movimiento === "Entrada" && (
                <div className="min-w-0">
                  <label className={labelClass}>Precio Unitario (C$)</label>

                  <input
                    type="number"
                    step="0.01"
                    name="precio_unitario"
                    value={form.precio_unitario}
                    onChange={handleChange}
                    disabled={guardando}
                    min="0.01"
                    placeholder="Ejemplo: 350.00"
                    className={inputClass}
                  />

                  {errors.precio_unitario && (
                    <p className={errorClass}>{errors.precio_unitario}</p>
                  )}
                </div>
              )}

              {form.tipo_movimiento === "Ajuste" && (
                <div className="min-w-0">
                  <label className={labelClass}>Nuevo Stock</label>

                  <input
                    type="number"
                    name="stock_nuevo"
                    value={form.stock_nuevo}
                    onChange={handleChange}
                    disabled={guardando}
                    min="0"
                    step="1"
                    placeholder="Ejemplo: 100"
                    className={inputClass}
                  />

                  {errors.stock_nuevo && (
                    <p className={errorClass}>{errors.stock_nuevo}</p>
                  )}
                </div>
              )}

              <div className="min-w-0">
                <label className={labelClass}>Referencia</label>

                <input
                  type="text"
                  name="referencia"
                  value={form.referencia}
                  onChange={handleChange}
                  disabled={guardando}
                  placeholder="Ejemplo: Compra FAC-001"
                  className={inputClass}
                />
              </div>

              <div className="min-w-0 md:col-span-2">
                <label className={labelClass}>Descripción</label>

                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  disabled={guardando}
                  rows={3}
                  placeholder="Descripción breve del movimiento"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <SummaryBox label="Stock actual" value={stockActual} />

              <SummaryBox
                label="Stock mínimo"
                value={stockMinimo}
                variant="yellow"
              />

              <SummaryBox
                label="Stock resultante"
                value={stockCalculado}
                variant={stockCalculado <= stockMinimo ? "red" : "blue"}
              />

              <SummaryBox
                label="Valor movimiento"
                value={`C$${money(valorMovimiento)}`}
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
              className="w-full rounded-2xl border border-slate-400 bg-slate-100 px-8 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
            >
              {guardando ? "Guardando..." : "Registrar Movimiento"}
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
    red: "border-red-200 bg-red-100 text-red-900",
    green: "border-emerald-200 bg-emerald-100 text-emerald-900",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};

export default MovimientosInventarioForm;