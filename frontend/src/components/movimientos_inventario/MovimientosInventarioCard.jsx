import React from "react";

const MovimientosInventarioCard = ({
  movimientos,
  onDelete,
  onVerDetalles,
}) => {
  const money = (value) =>
    Number(value ?? 0).toLocaleString("es-NI", {
      style: "currency",
      currency: "NIO",
      minimumFractionDigits: 2,
    });

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("es-NI", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getTipoStyle = (tipo) => {
    if (tipo === "Entrada") {
      return {
        label: "Entrada",
        box: "border-emerald-200 bg-emerald-100",
        text: "text-emerald-800",
      };
    }

    if (tipo === "Salida") {
      return {
        label: "Salida",
        box: "border-red-200 bg-red-100",
        text: "text-red-800",
      };
    }

    return {
      label: "Ajuste",
      box: "border-amber-200 bg-amber-100",
      text: "text-amber-800",
    };
  };

  if (!movimientos.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay movimientos registrados
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Registre una entrada, salida o ajuste de inventario.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {movimientos.map((movimiento) => {
        const tipoStyle = getTipoStyle(movimiento.tipoMovimiento);
        const costoTotal =
          Number(movimiento.cantidad ?? 0) *
          Number(movimiento.precioUnitario ?? 0);

        return (
          <div
            key={movimiento.id}
            className="
              overflow-hidden
              rounded-3xl
              border
              border-slate-300
              bg-slate-200
              shadow-md
              transition
              hover:-translate-y-1
              hover:border-blue-400
              hover:shadow-xl
            "
          >
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-cyan-900 px-5 py-4 text-white">
              <p className="text-sm font-medium text-cyan-100">
                Movimiento de inventario
              </p>

              <h3 className="mt-1 truncate text-sm font-bold">
                {movimiento.materialNombre || "Sin material"}
              </h3>
            </div>

            <div className="space-y-4 p-5">
              <div className={`rounded-2xl border p-4 ${tipoStyle.box}`}>
                <p className="text-sm font-semibold opacity-80">
                  Tipo de Movimiento
                </p>

                <p className={`mt-1 text-sm font-bold ${tipoStyle.text}`}>
                  {tipoStyle.label}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InfoBox
                  label="Cantidad"
                  value={Number(movimiento.cantidad ?? 0).toLocaleString(
                    "es-NI"
                  )}
                />

                <InfoBox
                  label="Unidad"
                  value={movimiento.unidadMedida || "—"}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InfoBox
                  label="Stock anterior"
                  value={Number(movimiento.stockAnterior ?? 0).toLocaleString(
                    "es-NI"
                  )}
                />

                <InfoBox
                  label="Stock nuevo"
                  value={Number(movimiento.stockNuevo ?? 0).toLocaleString(
                    "es-NI"
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoBox
                  label="Precio"
                  value={money(movimiento.precioUnitario)}
                  variant="green"
                />

                <InfoBox
                  label="Costo total"
                  value={money(movimiento.costoTotal || costoTotal)}
                  variant="green"
                />
              </div>

              <InfoBox
                label="Fecha"
                value={formatDate(movimiento.fechaMovimiento)}
              />

              <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onVerDetalles(movimiento)}
                  className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  Detalles
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(movimiento)}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const InfoBox = ({ label, value, variant = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-100 text-slate-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 truncate text-sm font-bold">{value}</p>
    </div>
  );
};

export default MovimientosInventarioCard;