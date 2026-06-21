import React from "react";

const MovimientosInventarioDetails = ({ movimiento, onClose, onDelete }) => {
  if (!movimiento) return null;

  const money = (value) =>
    Number(value ?? 0).toLocaleString("es-NI", {
      style: "currency",
      currency: "NIO",
      minimumFractionDigits: 2,
    });

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleString("es-NI", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const cantidad = Number(movimiento.cantidad ?? 0);
  const precio = Number(movimiento.precioUnitario ?? 0);
  const costoTotal = movimiento.costoTotal || cantidad * precio;

  const tipoVariant =
    movimiento.tipoMovimiento === "Entrada"
      ? "green"
      : movimiento.tipoMovimiento === "Salida"
      ? "red"
      : "yellow";

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
      <div
        className="
          w-full
          max-w-4xl
          overflow-hidden
          rounded-3xl
          border
          border-slate-300
          bg-slate-100
          shadow-2xl
        "
      >
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white sm:px-7">
          <p className="text-sm font-medium text-cyan-100">
            Movimientos de inventario
          </p>

          <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
            Detalles del Movimiento
          </h2>
        </div>

        <div className="max-h-[calc(100dvh-170px)] space-y-5 overflow-y-auto p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información general
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Datos principales del movimiento seleccionado.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoBox label="ID" value={movimiento.id || "—"} />

              <InfoBox
                label="Tipo de Movimiento"
                value={movimiento.tipoMovimiento || "—"}
                variant={tipoVariant}
              />

              <InfoBox
                label="Material"
                value={movimiento.materialNombre || "—"}
              />

              <InfoBox
                label="Unidad de Medida"
                value={movimiento.unidadMedida || "—"}
              />

              <InfoBox
                label="Cantidad"
                value={cantidad.toLocaleString("es-NI")}
                variant="blue"
              />

              <InfoBox
                label="Precio Unitario"
                value={money(precio)}
                variant="green"
              />

              <InfoBox
                label="Stock Anterior"
                value={Number(movimiento.stockAnterior ?? 0).toLocaleString(
                  "es-NI"
                )}
              />

              <InfoBox
                label="Stock Nuevo"
                value={Number(movimiento.stockNuevo ?? 0).toLocaleString(
                  "es-NI"
                )}
                variant="blue"
              />

              <InfoBox
                label="Costo Total"
                value={money(costoTotal)}
                variant="green"
              />

              <InfoBox
                label="Fecha"
                value={formatDate(movimiento.fechaMovimiento)}
              />

              <InfoBox
                label="Referencia"
                value={movimiento.referencia || "—"}
              />

              <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4 sm:col-span-2">
                <p className="text-sm font-semibold text-slate-600">
                  Descripción
                </p>

                <p className="mt-1 text-sm text-slate-800">
                  {movimiento.descripcion || "—"}
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-400 bg-slate-100 px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-300 sm:w-auto"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={() => onDelete(movimiento)}
              className="w-full rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 sm:w-auto"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value, variant = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-100 text-slate-800",
    blue: "border-blue-200 bg-blue-100 text-blue-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
    yellow: "border-amber-200 bg-amber-100 text-amber-800",
    red: "border-red-200 bg-red-100 text-red-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 break-words text-sm font-bold">{value}</p>
    </div>
  );
};

export default MovimientosInventarioDetails;