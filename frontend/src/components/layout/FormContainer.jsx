<div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
  <form
    onSubmit={handleSubmit}
    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-200 overflow-y-auto max-h-[100vh]"
  >
    <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">
      {isEdit ? "Editar Registro" : "Nuevo Registro"}
    </h2>

    {/* Campos del formulario */}
    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* Ejemplo de campo */}
      <div>
        <label className="block text-gray-900 font-medium mb-1">Campo</label>
        <input
          type="text"
          name="campo"
          value={form.campo}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>
    </div>

    {/* Botones */}
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
