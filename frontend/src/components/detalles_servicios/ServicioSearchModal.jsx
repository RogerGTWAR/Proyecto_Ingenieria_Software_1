import React, { useState, useEffect, useRef, useMemo } from "react";
import CloseButton from "../ui/CloseButton";

const toUI = (s = {}) => ({
  id: s.servicio_id ?? s.id,
  nombre: s.nombre_servicio ?? "",
  descripcion: s.descripcion ?? "",
  estado: s.estado ?? "Activo",
});

const ServicioSearchModal = ({
  isOpen,
  onClose,
  servicios = [],
  onSelectServicio,
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtrados, setFiltrados] = useState([]);
  const [selected, setSelected] = useState(null);
  const inputRef = useRef(null);

  const lista = useMemo(
    () => (Array.isArray(servicios) ? servicios.map(toUI) : []),
    [servicios]
  );

  // Reset al abrir
  useEffect(() => {
    if (isOpen) {
      setBusqueda("");
      setSelected(null);
      setFiltrados(lista);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, lista]);

  // Filtro
  useEffect(() => {
    if (!busqueda.trim()) {
      setFiltrados(lista);
      return;
    }
    const q = busqueda.toLowerCase();
    setFiltrados(
      lista.filter((s) =>
        `${s.nombre} ${s.descripcion}`.toLowerCase().includes(q)
      )
    );
  }, [busqueda, lista]);

  const choose = (svc) => {
    setSelected(svc);
  };

  const confirm = () => {
    if (selected) onSelectServicio(selected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>

      <div className="fixed inset-0 flex justify-center items-start pt-[120px] z-50 px-4">
        <div className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-200 relative">

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">Seleccionar Servicio</h2>
            <CloseButton onClick={onClose} />
          </div>

          <div className="mb-6">
            <label className="block text-gray-900 font-medium mb-1">Buscar</label>
            <input
              ref={inputRef}
              type="text"
              autoFocus
              placeholder="Nombre o descripción del servicio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900
              focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* LISTA */}
          <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-lg divide-y bg-white">
            {filtrados.length > 0 ? (
              filtrados.map((s) => {
                const checked = selected?.id === s.id;

                return (
                  <div
                    key={s.id}
                    className={`p-3 cursor-pointer hover:bg-gray-100 ${
                      checked ? "bg-blue-50" : ""
                    }`}
                    onClick={() => choose(s)}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{s.nombre}</p>
                        <p className="text-sm text-gray-600">{s.descripcion}</p>
                      </div>

                      {/* SOLO 1 */}
                      <input
                        type="radio"
                        name="svcSelect"
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
                No se encontraron servicios.
              </div>
            )}
          </div>

          {/* BOTONES */}
          <div className="flex justify-center gap-6 mt-8">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-900 px-7 py-3 rounded-md hover:bg-gray-400 transition"
            >
              Cancelar
            </button>

            <button
              onClick={confirm}
              disabled={!selected}
              className="text-white px-7 py-3 rounded-md transition hover:scale-105 disabled:opacity-40"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Seleccionar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicioSearchModal;
