import React from "react";

const ComprasCard = ({ compras, onEdit, onDelete, onVerDetalles }) => {
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

  if (!compras.length) {
    return (
      <div className="flex min-h-[260px] w-full items-center justify-center rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <div>
          <p className="text-sm font-bold text-slate-800">
            No hay compras registradas
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Registre una nueva compra para comenzar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        w-full
        grid-cols-1
        gap-4
        md:grid-cols-2
        2xl:grid-cols-3
      "
    >
      {compras.map((c) => (
        <div
          key={c.id}
          className="
            flex
            min-h-[360px]
            w-full
            flex-col
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
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-4 text-white">
            <p className="text-sm font-medium text-cyan-100">
              Compra registrada
            </p>

            <h3 className="mt-1 truncate text-sm font-bold">
              Compra #{c.id}
            </h3>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <InfoBox label="Factura" value={c.numero_factura || "—"} />

                <InfoBox label="Fecha" value={c.fecha_compra || "—"} />
              </div>

              <InfoBox label="Proveedor" value={c.proveedorNombre || "—"} />

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <InfoBox
                  label="Monto Total"
                  value={money(c.monto_total)}
                  variant="green"
                />

                <div
                  className={`
                    rounded-2xl
                    border
                    p-4
                    ${
                      estadoClass[c.estado] ||
                      "border-slate-300 bg-slate-100 text-slate-800"
                    }
                  `}
                >
                  <p className="text-sm font-semibold opacity-80">Estado</p>

                  <p className="mt-1 text-sm font-bold">
                    {c.estado || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => onVerDetalles(c)}
                className="
                  rounded-xl
                  bg-blue-700
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-blue-800
                "
              >
                Detalles
              </button>

              <button
                type="button"
                onClick={() => onEdit(c)}
                className="
                  rounded-xl
                  border
                  border-slate-400
                  bg-slate-100
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-slate-800
                  transition
                  hover:bg-slate-300
                "
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onDelete(c)}
                className="
                  rounded-xl
                  bg-red-600
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-red-700
                "
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
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

      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};

export default ComprasCard;