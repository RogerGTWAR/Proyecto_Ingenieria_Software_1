import React, { useEffect, useMemo } from "react";
import { useDetallesCompras } from "../../hooks/useDetallesCompras";

export default function ComprasDetails({ compra, onClose, onEdit, onDelete }) {
  const { items: detalles, reload } = useDetallesCompras();

  useEffect(() => {
    reload();
  }, [compra]);

  if (!compra) return null;

  const detallesCompra = useMemo(() => {
    return detalles
      .filter((d) => Number(d.compraId) === Number(compra.id))
      .map((d) => ({
        ...d,
        subtotal: Number(d.cantidad) * Number(d.precio_unitario),
      }));
  }, [detalles, compra]);

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <div className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">

        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4 text-center">
          Compra #{compra.id}
        </h2>

        <div className="space-y-2 text-gray-700 mb-6">
          <p><strong>Número de Factura:</strong> {compra.numero_factura}</p>
          <p><strong>Fecha:</strong> {compra.fecha_compra}</p>
          <p><strong>Proveedor:</strong> {compra.proveedorNombre}</p>
          <p><strong>Empleado:</strong> {compra.empleadoNombre}</p>

          <p>
            <strong>Monto Total:</strong>{" "}
            <span className="text-green-700 font-bold">
              C${compra.monto_total.toLocaleString("es-NI")}
            </span>
          </p>

          <p><strong>Estado:</strong> {compra.estado}</p>
          <p>
            <strong>Observaciones:</strong>{" "}
            {compra.observaciones?.trim() || "—"}
          </p>
        </div>

        <h3 className="text-lg font-semibold text-[var(--color-primary)] mt-6 mb-2">
          Materiales Comprados
        </h3>

        {detallesCompra.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detallesCompra.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-gray-300 bg-[#F9FAFB] p-4 shadow-sm hover:shadow-md transition"
              >
                <h4 className="text-base font-semibold text-gray-800 mb-3">
                  {m.materialNombre}
                </h4>

                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Cantidad:</strong> {m.cantidad}</p>

                  <p>
                    <strong>P. Unitario:</strong>{" "}
                    C${m.precio_unitario.toLocaleString("es-NI")}
                  </p>

                  <p>
                    <strong>Subtotal:</strong>{" "}
                    <span className="font-bold">
                      C${m.subtotal.toLocaleString("es-NI")}
                    </span>
                  </p>
                </div>

                <p className="font-bold mt-2">
                  TOTAL: C${m.subtotal.toLocaleString("es-NI")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No hay materiales registrados.</p>
        )}

        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => onEdit(compra)}
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81" }}
          >
            Editar
          </button>

          <button
            onClick={() => onDelete(compra)}
            className="bg-red-600 text-white text-base font-medium px-7 py-3 rounded-md hover:bg-red-700"
          >
            Eliminar
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 text-base font-medium px-7 py-3 rounded-md hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
