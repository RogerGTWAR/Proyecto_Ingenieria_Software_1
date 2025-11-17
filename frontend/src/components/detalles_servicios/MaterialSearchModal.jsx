// MaterialSearchModal.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import CloseButton from "../ui/CloseButton";

const money = (n) => `C$ ${Number(n || 0).toFixed(2)}`;

export default function MaterialSearchModal({
  isOpen,
  onClose,
  materiales = [],
  onSelectMateriales,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtrados, setFiltrados] = useState([]);
  const [selected, setSelected] = useState([]); // MULTI-SELECCIÓN
  const inputRef = useRef(null);

  // ============================================================
  // NORMALIZAR LISTA
  // ============================================================
  const lista = useMemo(() => {
    return (Array.isArray(materiales) ? materiales : []).map((m) => {
      const real = m.material_id_materiales ?? m;

      return {
        id: Number(real.material_id ?? real.id),
        real,
        nombre: real.nombre_material ?? "Material",
        unidad: real.unidad_de_medida ?? "",
        precio: Number(real.precio_unitario ?? 0),
      };
    });
  }, [materiales]);

  // ============================================================
  // RESET AL ABRIR
  // ============================================================
  useEffect(() => {
    if (isOpen) {
      setBusqueda("");
      setSelected([]); 
      setFiltrados(lista);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, lista]);

  // ============================================================
  // FILTRO
  // ============================================================
  useEffect(() => {
    if (!busqueda.trim()) return setFiltrados(lista);

    const q = busqueda.toLowerCase();

    setFiltrados(
      lista.filter((m) =>
        `${m.nombre} ${m.unidad}`.toLowerCase().includes(q)
      )
    );
  }, [busqueda, lista]);

  // ============================================================
  // TOGGLE MULTI-SELECCIÓN
  // ============================================================
  const toggle = (mat) => {
    setSelected((prev) => {
      const exists = prev.some((x) => x.id === mat.id);
      return exists
        ? prev.filter((x) => x.id !== mat.id)
        : [...prev, mat];
    });
  };

  // ============================================================
  // CONFIRMAR — DEVUELVE SOLO LOS OBJETOS REALES
  // ============================================================
  const confirm = () => {
    if (!selected.length) return;

    const reales = selected.map((x) => x.real);

    onSelectMateriales(reales);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-start pt-[120px] z-50 px-4">
      <div className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-200 relative">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">
            Seleccionar Materiales
          </h2>
          <CloseButton onClick={onClose} />
        </div>

        {/* BUSCADOR */}
        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-1">Buscar</label>
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por nombre o unidad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* LISTA */}
        <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-lg divide-y bg-white">
          {filtrados.length ? (
            filtrados.map((m) => {
              const checked = selected.some((x) => x.id === m.id);

              return (
                <div
                  key={m.id}
                  onClick={() => toggle(m)}
                  className={`p-3 cursor-pointer hover:bg-gray-100 ${
                    checked ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">

                    <div>
                      <p className="font-medium text-gray-900">{m.nombre}</p>
                      <p className="text-sm text-gray-600">Unidad: {m.unidad}</p>
                      <p className="text-xs text-gray-500">Precio: {money(m.precio)}</p>
                    </div>

                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="h-4 w-4 accent-[var(--color-primary)]"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              No se encontraron materiales.
            </div>
          )}
        </div>

        {/* BOTONES */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-900 px-7 py-3 rounded-md"
          >
            Cancelar
          </button>

          <button
            onClick={confirm}
            disabled={selected.length === 0}
            className="text-white px-7 py-3 rounded-md disabled:opacity-40"
            style={{ backgroundColor: "#1A2E81" }}
          >
            Seleccionar {selected.length > 0 ? `(${selected.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
