<div
  className="
    fixed
    left-0
    right-0
    bottom-0
    top-16
    z-40
    flex
    items-center
    justify-center
    overflow-y-auto
    bg-slate-900/35
    px-4
    py-6
    lg:left-48
  "
>
  <form
    onSubmit={handleSubmit}
    className="
      flex
      w-full
      max-w-2xl
      max-h-[calc(100dvh-96px)]
      flex-col
      overflow-hidden
      rounded-3xl
      border
      border-slate-300
      bg-slate-100
      shadow-2xl
    "
  >
    <div
      className="
        shrink-0
        bg-gradient-to-r
        from-slate-950
        via-blue-950
        to-cyan-900
        px-5
        py-5
        text-white
        sm:px-7
      "
    >
      <p className="text-sm font-medium text-cyan-100">
        Gestión de registros
      </p>

      <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
        {isEdit ? "Editar Registro" : "Nuevo Registro"}
      </h2>
    </div>

    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6">
      <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
        <div className="mb-5 border-b border-slate-300 pb-4">
          <h3 className="text-sm font-bold text-slate-900">
            Información general
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Complete los datos del registro.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="min-w-0">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Campo
            </label>

            <input
              type="text"
              name="campo"
              value={form.campo}
              onChange={handleChange}
              className="
                w-full
                min-w-0
                rounded-xl
                border
                border-slate-300
                bg-slate-100
                px-3
                py-3
                text-sm
                text-slate-800
                shadow-sm
                outline-none
                transition
                placeholder:text-sm
                placeholder:text-slate-400
                focus:border-blue-600
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
                sm:px-4
              "
            />
          </div>
        </div>
      </section>
    </div>

    <div className="shrink-0 border-t border-slate-300 bg-slate-100 px-4 py-4 sm:px-6">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="
            w-full
            rounded-2xl
            border
            border-slate-400
            bg-slate-100
            px-8
            py-3
            text-sm
            font-bold
            text-slate-800
            shadow-sm
            transition
            hover:bg-slate-300
            sm:w-auto
          "
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="
            w-full
            rounded-2xl
            bg-gradient-to-r
            from-blue-800
            to-cyan-700
            px-8
            py-3
            text-sm
            font-bold
            text-white
            shadow-lg
            transition
            hover:scale-[1.01]
            hover:shadow-xl
            sm:w-auto
          "
        >
          {isEdit ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </div>
  </form>
</div>