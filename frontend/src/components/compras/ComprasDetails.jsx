import React, { useEffect, useMemo } from "react";
import { useDetallesCompras } from "../../hooks/useDetallesCompras";

export default function ComprasDetails({ compra, onClose, onEdit, onDelete }) {
  const { items: detalles, reload } = useDetallesCompras();

  useEffect(() => {
    if (compra) reload();
  }, [compra, reload]);

  const detallesCompra = useMemo(() => {
    if (!compra) return [];

    return detalles
      .filter((d) => Number(d.compraId) === Number(compra.id))
      .map((d) => ({
        ...d,
        subtotal: Number(d.cantidad ?? 0) * Number(d.precio_unitario ?? 0),
      }));
  }, [detalles, compra]);

  if (!compra) return null;

  const money = (value) =>
    Number(value ?? 0).toLocaleString("es-NI", {
      style: "currency",
      currency: "NIO",
      minimumFractionDigits: 2,
    });

  const estadoClass = {
    Pagada: "border-emerald-200 bg-emerald-100 text-emerald-800",
    Pendiente: "border-amber-200 bg-amber-100 text-amber-800",
    Cancelada: "border-red-200 bg-red-100 text-red-800",
  };

  return (
    <div
      className="
        fixed left-0 right-0 bottom-0 top-16 z-40
        flex items-center justify-center overflow-y-auto
        bg-slate-900/35 px-4 py-6 lg:left-48
      "
    >
      <div
        className="
          w-full max-w-5xl overflow-hidden
          rounded-3xl border border-slate-300
          bg-slate-100 shadow-2xl
        "
      >
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white sm:px-7">
          <p className="text-sm font-medium text-cyan-100">
            Gestión de compras
          </p>

          <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
            Compra #{compra.id}
          </h2>
        </div>

        <div className="max-h-[calc(100dvh-170px)] space-y-5 overflow-y-auto p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información general
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Datos principales de la compra seleccionada.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoBox label="Número de Factura" value={compra.numero_factura || "—"} />
              <InfoBox label="Fecha" value={compra.fecha_compra || "—"} />
              <InfoBox label="Proveedor" value={compra.proveedorNombre || "—"} />
              <InfoBox label="Empleado" value={compra.empleadoNombre || "—"} />
              <InfoBox label="Monto Total" value={money(compra.monto_total)} variant="green" />

              <div
                className={`
                  rounded-2xl border p-4
                  ${estadoClass[compra.estado] || "border-slate-300 bg-slate-100 text-slate-800"}
                `}
              >
                <p className="text-sm font-semibold opacity-80">Estado</p>
                <p className="mt-1 text-sm font-bold">{compra.estado || "—"}</p>
              </div>

              <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4 md:col-span-2">
                <p className="text-sm font-semibold text-slate-600">
                  Observaciones
                </p>
                <p className="mt-1 text-sm text-slate-800">
                  {compra.observaciones?.trim() || "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Materiales comprados
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Detalle de materiales asociados a esta compra.
              </p>
            </div>

            {detallesCompra.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {detallesCompra.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
                  >
                    <h4 className="mb-3 text-sm font-bold text-slate-900">
                      {m.materialNombre}
                    </h4>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <MiniBox label="Cantidad" value={m.cantidad} />
                      <MiniBox label="P. Unitario" value={money(m.precio_unitario)} />
                      <MiniBox label="Subtotal" value={money(m.subtotal)} green />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-400 bg-slate-100 px-6 py-8 text-center">
                <p className="text-sm font-bold text-slate-700">
                  No hay materiales registrados
                </p>
              </div>
            )}
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
              onClick={() => onDelete(compra)}
              className="w-full rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 sm:w-auto"
            >
              Eliminar
            </button>

            <button
              type="button"
              onClick={() => onEdit(compra)}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl sm:w-auto"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoBox = ({ label, value, variant = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-100 text-slate-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};

const MiniBox = ({ label, value, green = false }) => (
  <div
    className={`
      rounded-xl border p-3
      ${
        green
          ? "border-emerald-200 bg-emerald-100 text-emerald-800"
          : "border-slate-300 bg-slate-200 text-slate-800"
      }
    `}
  >
    <p className="text-sm font-semibold opacity-80">{label}</p>
    <p className="mt-1 text-sm font-bold">{value}</p>
  </div>
);