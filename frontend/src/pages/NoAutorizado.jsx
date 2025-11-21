export default function NoAutorizado() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 shadow-lg rounded-xl text-center">
        <h1 className="text-3xl font-bold text-red-600">Acceso Denegado</h1>
        <p className="text-gray-700 mt-3">
          No tienes permisos para acceder a esta página.
        </p>
      </div>
    </div>
  );
}
