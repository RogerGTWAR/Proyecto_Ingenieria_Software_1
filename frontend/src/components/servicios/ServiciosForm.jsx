import React, { useEffect, useState } from "react";

const ServiciosForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const [form, setForm] = useState({
    nombreServicio: "",
    descripcion: "",
    precioUnitario: "",
    cantidad: "",
    unidadDeMedida: "",
    estado: "Activo",
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
    const actualizado = await onSubmit(form);

    if (actualizado && actualizado.id) {
      setForm(actualizado);
    }
  };


  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-200 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">
          {isEdit ? "Editar Servicio" : "Nuevo Servicio"}
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Nombre del Servicio
            </label>
            <input
              type="text"
              name="nombreServicio"
              value={form.nombreServicio}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">
              Precio Unitario (C$)
            </label>
            <input
              type="number"
              step="0.01"
              name="precioUnitario"
              value={form.precioUnitario}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">Unidad de Medida</label>
            <input
              type="text"
              name="unidadDeMedida"
              value={form.unidadDeMedida}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-900 font-medium mb-1">Fecha Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1">Fecha Fin</label>
            <input
              type="date"
              name="fechaFin"
              value={form.fechaFin}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-1">Estado</label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-1">Descripción</label>
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

export default ServiciosForm;
