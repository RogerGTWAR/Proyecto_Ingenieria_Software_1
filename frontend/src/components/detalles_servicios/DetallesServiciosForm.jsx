// DetallesServiciosForm.jsx
import React, { useEffect, useState } from "react";
import CloseButton from "../ui/CloseButton";

import MaterialCardAvailable from "./MaterialCardAvailable";
import MaterialSearchModal from "./MaterialSearchModal";

import ServicioCardAvailable from "./ServicioCardAvailable";
import ServicioSearchModal from "./ServicioSearchModal";

// Helpers
const num = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

export default function DetallesServiciosForm({
  onSubmit,
  onClose,
  initialData,
  isEdit = false,
  servicios = [],
  materiales = [],
}) {
  const [form, setForm] = useState({
    servicio_id: "",
    cantidad: 1,
    unidad_de_medida: "",
    descripcion: "",
    precio_unitario: "",
  });

  const [selectedServicio, setSelectedServicio] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [showServicioModal, setShowServicioModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  // ============================================================
  // CARGAR DATOS INICIALES (EDITAR)
  // ============================================================
  useEffect(() => {
    if (!initialData) return;

    const servicioId = initialData.servicioId ?? initialData.servicio_id;
    const materialId = initialData.materialId ?? initialData.material_id;

    setForm({
      servicio_id: servicioId,
      cantidad: num(initialData.cantidad, 1),
      unidad_de_medida: initialData.unidad ?? initialData.unidad_de_medida ?? "",
      descripcion: initialData.descripcion ?? "",
      precio_unitario:
        initialData.precioUnitario ??
        initialData.precio_unitario ??
        "",
    });

    const svc = servicios.find(
      (s) => Number(s.servicio_id ?? s.id) === Number(servicioId)
    );
    if (svc) setSelectedServicio(svc);

    const mat = materiales.find(
      (m) => Number(m.material_id ?? m.id) === Number(materialId)
    );
    if (mat) setSelectedMaterial(mat);
  }, [initialData, servicios, materiales]);

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "cantidad" ? Math.max(1, num(value, 1)) : value,
    }));
  };

  const handleSelectServicio = (svc) => {
    setSelectedServicio(svc);
    setForm((prev) => ({
      ...prev,
      servicio_id: svc.servicio_id ?? svc.id,
    }));
  };

  // ============================================================
  // CALCULO TOTAL
  // ============================================================
  const total = num(form.cantidad) * num(form.precio_unitario);

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.servicio_id) return alert("Selecciona un servicio.");
    if (!selectedMaterial) return alert("Selecciona un material.");
    if (!form.precio_unitario) return alert("Ingresa un precio unitario.");

    const payload = {
      servicio_id: Number(form.servicio_id),
      material_id: Number(
        selectedMaterial.material_id ?? selectedMaterial.id
      ),
      cantidad: num(form.cantidad, 1),
      unidad_de_medida: form.unidad_de_medida,
      descripcion: form.descripcion || null,
      precio_unitario: num(form.precio_unitario, 0),
    };

    onSubmit?.(payload);
  };

  // ============================================================
  // UI
  // ============================================================
  return (
    <>
      <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
        <form
          onSubmit={handleSubmit}
          className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-3xl p-8 border border-gray-200 overflow-y-auto max-h-[90vh]"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">
              {isEdit ? "Editar Detalle de Servicio" : "Nuevo Detalle de Servicio"}
            </h2>
            <CloseButton onClick={onClose} />
          </div>

          {/* SERVICIO + MATERIAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* SERVICIO */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-gray-900">Servicio *</label>
                <button
                  type="button"
                  onClick={() => setShowServicioModal(true)}
                  className="text-white text-xs px-3 py-1 rounded-md"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Buscar servicio
                </button>
              </div>

              {selectedServicio ? (
                <ServicioCardAvailable servicio={selectedServicio} />
              ) : (
                <div className="border-2 border-dashed p-4 rounded-xl text-center">
                  No hay servicio seleccionado.
                </div>
              )}
            </div>

            {/* MATERIAL */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-gray-900">Material *</label>
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(true)}
                  className="text-white text-xs px-3 py-1 rounded-md"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Buscar material
                </button>
              </div>

              {selectedMaterial ? (
                <MaterialCardAvailable material={selectedMaterial} />
              ) : (
                <div className="border-2 border-dashed p-4 rounded-xl text-center">
                  No hay material seleccionado.
                </div>
              )}
            </div>
          </div>

          {/* CANTIDAD / UNIDAD / PRECIO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Cantidad */}
            <div>
              <label className="font-medium text-gray-900 mb-1 block">
                Cantidad *
              </label>
              <input
                type="number"
                min="1"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* Unidad */}
            <div>
              <label className="font-medium text-gray-900 mb-1 block">
                Unidad
              </label>
              <input
                type="text"
                name="unidad_de_medida"
                value={form.unidad_de_medida}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Precio */}
            <div>
              <label className="font-medium text-gray-900 mb-1 block">
                Precio unitario (C$) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="precio_unitario"
                value={form.precio_unitario}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          {/* TOTAL */}
          <div className="bg-white border rounded-xl p-4 mb-6 text-sm">
            <div className="flex justify-between text-gray-700">
              <span>Total (C$):</span>
              <span className="font-semibold text-[var(--color-primary)]">
                C$ {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="mb-6">
            <label className="font-medium text-gray-900 mb-1 block">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* BOTONES */}
          <div className="flex justify-center gap-6 mt-4">
            <button
              type="submit"
              className="text-white text-base font-medium px-7 py-3 rounded-md"
              style={{ backgroundColor: "#1A2E81" }}
            >
              {isEdit ? "Guardar Cambios" : "Guardar Detalle"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-900 text-base font-medium px-7 py-3 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* MODALES */}
      <ServicioSearchModal
        isOpen={showServicioModal}
        onClose={() => setShowServicioModal(false)}
        servicios={servicios}
        onSelectServicio={handleSelectServicio}
      />

      <MaterialSearchModal
        isOpen={showMaterialModal}
        onClose={() => setShowMaterialModal(false)}
        materiales={materiales}
        onSelectMateriales={(selectedList) => {
          if (!selectedList?.length) return;

          const elegido = selectedList[0];

          const real =
            materiales.find(
              (m) =>
                Number(m.material_id ?? m.id) ===
                Number(elegido.material_id ?? elegido.id)
            ) || elegido;

          setSelectedMaterial(real);
        }}
      />
    </>
  );
}
