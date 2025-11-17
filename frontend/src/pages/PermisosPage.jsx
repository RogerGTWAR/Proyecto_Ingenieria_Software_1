import React, { useState } from "react";
import { usePermisos } from "../hooks/usePermisos";

export default function PermisosPage() {
  const [documento, setDocumento] = useState("");
  const [empleado, setEmpleado] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);

  const {
    asignados,
    noAsignados,
    loading,
    error,
    asignar,
    remover,
  } = usePermisos(usuarioId);

  const [seleccionAsignados, setSeleccionAsignados] = useState({});
  const [seleccionNoAsignados, setSeleccionNoAsignados] = useState({});

  const buscarEmpleado = () => {
    // TODO: reemplazar por una llamada real al backend
    // que busque por documento y devuelva empleado + usuario_id
    const fakeEmpleado = {
      nombres: "Juan Carlos",
      apellidos: "Rivas López",
      tipo: "Administrativo",
      usuario: "jc.rivas",
      documento,
      usuario_id: 1, // <- aquí vinculas con tu tabla usuarios
    };

    setEmpleado(fakeEmpleado);
    setUsuarioId(fakeEmpleado.usuario_id);
    setSeleccionAsignados({});
    setSeleccionNoAsignados({});
  };

  const toggleSeleccionAsignado = (menuId) => {
    setSeleccionAsignados((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const toggleSeleccionNoAsignado = (menuId) => {
    setSeleccionNoAsignados((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleRemover = async () => {
    if (!usuarioId) return;

    const ids = Object.keys(seleccionAsignados)
      .filter((k) => seleccionAsignados[k])
      .map((k) => Number(k));

    if (ids.length === 0) return;

    await remover(ids);
    setSeleccionAsignados({});
  };

  const handleAsignar = async () => {
    if (!usuarioId) return;

    const ids = Object.keys(seleccionNoAsignados)
      .filter((k) => seleccionNoAsignados[k])
      .map((k) => Number(k));

    if (ids.length === 0) return;

    await asignar(ids);
    setSeleccionNoAsignados({});
  };

  const renderSubmenu = (m) => (m?.es_submenu ? "Si" : "No");
  const renderMenuPrincipal = (m) =>
    m?.id_menu_parent ? "Submenú" : "Principal";

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] text-center">
        Gestionar Permisos
      </h1>

      {/* DATOS DEL EMPLEADO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow">
        {/* Izquierda */}
        <div>
          <label className="font-semibold block mb-1">
            Documento de Identidad
          </label>
          <div className="flex gap-2 mb-4">
            <input
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={buscarEmpleado}
              className="bg-[var(--color-primary)] text-white px-4 rounded hover:opacity-90"
            >
              Buscar
            </button>
          </div>

          {empleado && (
            <>
              <p>
                <b>Nombres:</b> {empleado.nombres}
              </p>
              <p>
                <b>Apellidos:</b> {empleado.apellidos}
              </p>
            </>
          )}
        </div>

        {/* Derecha */}
        {empleado && (
          <div className="space-y-1">
            <p>
              <b>Nro Documento:</b> {empleado.documento}
            </p>
            <p>
              <b>Tipo Empleado:</b> {empleado.tipo}
            </p>
            <p>
              <b>Usuario:</b> {empleado.usuario}
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-center">
          Ocurrió un error al cargar permisos: {error}
        </p>
      )}

      {empleado && (
        <>
          {/* PERMISOS ASIGNADOS */}
          <h2 className="text-2xl font-semibold text-center">
            Permisos Asignados
          </h2>

          {loading && (
            <p className="text-center text-sm text-gray-500">
              Cargando permisos...
            </p>
          )}

          <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Seleccionar</th>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Ruta</th>
                  <th className="p-2 text-left">Submenú</th>
                  <th className="p-2 text-left">Menú Principal</th>
                </tr>
              </thead>
              <tbody>
                {asignados.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-3 text-center text-gray-500 italic"
                    >
                      No hay permisos asignados.
                    </td>
                  </tr>
                )}

                {asignados.map((p) => {
                  const m = p.menu;
                  return (
                    <tr key={p.id} className="border-t">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={!!seleccionAsignados[m?.id]}
                          onChange={() => toggleSeleccionAsignado(m.id)}
                        />
                      </td>
                      <td className="p-2">{m?.nombre}</td>
                      <td className="p-2">{m?.url ?? "-"}</td>
                      <td className="p-2">{renderSubmenu(m)}</td>
                      <td className="p-2">{renderMenuPrincipal(m)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-3">
            <button
              onClick={handleRemover}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              disabled={loading}
            >
              Remover Permisos
            </button>
          </div>

          {/* PERMISOS NO ASIGNADOS */}
          <h2 className="text-2xl font-semibold text-center mt-6">
            Permisos No Asignados
          </h2>

          <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Seleccionar</th>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Ruta</th>
                  <th className="p-2 text-left">Submenú</th>
                  <th className="p-2 text-left">Menú Principal</th>
                </tr>
              </thead>
              <tbody>
                {noAsignados.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-3 text-center text-gray-500 italic"
                    >
                      No hay menús disponibles para asignar.
                    </td>
                  </tr>
                )}

                {noAsignados.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={!!seleccionNoAsignados[m.id]}
                        onChange={() => toggleSeleccionNoAsignado(m.id)}
                      />
                    </td>
                    <td className="p-2">{m.nombre}</td>
                    <td className="p-2">{m.url ?? "-"}</td>
                    <td className="p-2">{renderSubmenu(m)}</td>
                    <td className="p-2">{renderMenuPrincipal(m)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-3">
            <button
              onClick={handleAsignar}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
            >
              Asignar Permisos
            </button>
          </div>
        </>
      )}
    </div>
  );
}
