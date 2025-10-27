import React, { useEffect, useState } from "react";
import { useProyectos } from "../../hooks/useProyectos";

const AvaluosForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: proyectos } = useProyectos();

  const [form, setForm] = useState({
    proyectoId: "",
    descripcion: "",
    montoEjecutado: "",
    fechaInicio: "",
    fechaFin: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-200 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">
          {isEdit ? "Editar Avalúo" : "Nuevo Avalúo"}
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Proyecto
            </label>
            <select
              name="proyectoId"
              value={form.proyectoId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            >
              <option value="">Seleccione un proyecto</option>
              {proyectos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombreProyecto}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Monto Ejecutado (C$)
            </label>
            <input
              type="number"
              name="montoEjecutado"
              value={form.montoEjecutado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              name="fechaFin"
              value={form.fechaFin}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
          ></textarea>
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button
            type="submit"
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            {isEdit ? "Actualizar" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-900 text-base font-medium px-7 py-3 rounded-md hover:bg-gray-400 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvaluosForm;
