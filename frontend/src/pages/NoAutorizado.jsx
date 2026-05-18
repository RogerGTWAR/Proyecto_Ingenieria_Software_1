import { useNavigate } from "react-router-dom";

export default function NoAutorizado() {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100dvh-64px)] w-full overflow-hidden bg-slate-200 px-3 py-4 sm:px-4 lg:px-5 xl:px-6">
      <div className="flex min-h-full w-full items-center justify-center">
        <section className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 shadow-2xl">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-6 py-6 text-center text-white sm:px-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-red-300/40 bg-red-500/20 text-3xl shadow-lg">
              ⚠
            </div>

            <p className="text-sm font-medium text-cyan-100">
              Seguridad del sistema
            </p>

            <h1 className="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              Acceso denegado
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              No tienes permisos suficientes para acceder a esta página.
            </p>
          </div>

          <div className="bg-slate-100 p-5 sm:p-7">
            <div className="rounded-3xl border border-red-200 bg-red-100 px-5 py-5 text-center text-red-800 shadow-sm">
              <p className="text-sm font-bold">
                Tu cuenta no tiene acceso a este módulo.
              </p>

              <p className="mt-2 text-sm leading-6">
                Si consideras que deberías poder ingresar, solicita a un
                administrador que revise tus permisos.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full rounded-2xl border border-slate-400 bg-slate-100 px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-300 sm:w-auto"
              >
                Volver atrás
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl sm:w-auto"
              >
                Ir al dashboard
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}