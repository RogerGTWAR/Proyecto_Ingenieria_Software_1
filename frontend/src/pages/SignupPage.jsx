import { Link } from 'react-router-dom';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="ACONSA" className="mx-auto h-16 w-auto" />
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">Cree una cuenta</h1>
        <p className="text-center mb-6">
          ¿Ya tiene cuenta? <Link to="/login" className="text-blue-500 hover:underline">Iniciar sesión</Link>
        </p>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="correo">Correo</label>
            <input
              type="email"
              id="correo"
              className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="nombre@gmail.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="contrasena">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                id="contrasena"
                className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="confirmar">Confirmar contraseña</label>
            <div className="relative">
              <input
                type="password"
                id="confirmar"
                className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-700">Recordar contraseña</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;