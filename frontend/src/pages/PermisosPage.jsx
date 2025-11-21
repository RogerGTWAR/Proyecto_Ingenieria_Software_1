// pages/PermisosPage.jsx
import { useState } from "react";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";
import { usePermisos } from "../hooks/usePermisos";

export default function PermisosPage() {
  const {
    empleado,
    asignados,
    noAsignados,
    loading,
    error,

    buscar,
    loadMenus,
    loadAsignados,
    loadNoAsignados,
    asignar,
    remover,
  } = usePermisos();

  const [documento, setDocumento] = useState("");
  const [seleccionAsignados, setSeleccionAsignados] = useState([]);
  const [seleccionNoAsignados, setSeleccionNoAsignados] = useState([]);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  /* ============================================================
     BUSCAR EMPLEADO
     ============================================================ */
  const handleBuscarEmpleado = async () => {
    if (!documento.trim()) return alert("Ingrese una cédula.");

    const emp = await buscar(documento.trim());

    if (!emp) return;

    const usuario = emp.usuarios?.[0];

    if (!usuario) {
      alert("⚠ Este empleado no tiene usuario asignado.");
      return;
    }

    await loadMenus();
    await loadAsignados(usuario.usuario_id);
    await loadNoAsignados(usuario.usuario_id);
  };

  /* ============================================================
     SELECTORES
     ============================================================ */
  const toggleSeleccionAsignado = (id) => {
    setSeleccionAsignados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSeleccionNoAsignado = (id) => {
    setSeleccionNoAsignados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ============================================================
     ASIGNAR PERMISOS
     ============================================================ */
  const handleAsignar = async () => {
    const usuario = empleado?.usuarios?.[0];

    if (!usuario) {
      alert("Este empleado no tiene usuario asignado.");
      return;
    }

    if (seleccionNoAsignados.length === 0)
      return alert("Debe seleccionar al menos un menú.");

    await asignar(usuario.usuario_id, seleccionNoAsignados);
    setSeleccionNoAsignados([]);
  };

  /* ============================================================
     CONFIRMAR REMOVER
     ============================================================ */
  const confirmarRemover = () => {
    if (seleccionAsignados.length === 0)
      return alert("Debe seleccionar al menos un menú.");

    setConfirmRemoveOpen(true);
  };

  const handleRemover = async () => {
    const usuario = empleado?.usuarios?.[0];

    await remover(usuario.usuario_id, seleccionAsignados);
    setSeleccionAsignados([]);
    setConfirmRemoveOpen(false);
  };

  /* ============================================================
     UI
     ============================================================ */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="heading-1 text-[var(--color-primary)] mb-2">
        Gestión de Permisos
      </h1>
      <p className="body-1 text-[var(--color-gray)] mb-6">
        Asigna o remueve acceso a los módulos del sistema.
      </p>

      {/* BUSCADOR */}
      <div className="bg-white rounded-xl shadow p-4 mb-8 flex items-center gap-4">
        <input
          type="text"
          placeholder="Ingresar cédula del empleado..."
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
        />

        <button
          onClick={handleBuscarEmpleado}
          className="px-5 py-2 bg-[#1A2E81] text-white rounded-lg hover:scale-105 transition"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {/* INFO EMPLEADO */}
      {empleado && (
        <div className="bg-white rounded-xl shadow p-4 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">
            Empleado encontrado
          </h2>
          <p className="mt-2 text-gray-700">
            <strong>Nombre: </strong> {empleado.nombres} {empleado.apellidos}
          </p>
          <p className="text-gray-700">
            <strong>Usuario: </strong>{" "}
            {empleado.usuarios?.[0]?.usuario ?? "—"}
          </p>
          <p className="text-gray-700">
            <strong>Rol: </strong> {empleado.roles?.cargo ?? "—"}
          </p>
        </div>
      )}

      {/* TABLAS */}
      {empleado && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ASIGNADOS */}
          <div className="bg-white rounded-xl border shadow p-4">
            <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
              Permisos Asignados
            </h3>

            {asignados.length === 0 ? (
              <p className="text-gray-500">No hay permisos asignados.</p>
            ) : (
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                {asignados.map((a) => (
                  <label
                    key={a.permisoId}
                    className="flex items-center gap-3 bg-gray-50 border rounded-lg px-3 py-2 hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={seleccionAsignados.includes(a.menuId)}
                      onChange={() => toggleSeleccionAsignado(a.menuId)}
                    />
                    <div>
                      <p className="font-medium">{a.nombre}</p>
                      <p className="text-sm text-gray-600">
                        {a.url || "—"} ({a.esSubmenu ? "Submenú" : "Menú"})
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <button
              onClick={confirmarRemover}
              className="mt-4 bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
            >
              Remover seleccionados
            </button>
          </div>

          {/* NO ASIGNADOS */}
          <div className="bg-white rounded-xl border shadow p-4">
            <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
              Menús Disponibles para Asignar
            </h3>

            {noAsignados.length === 0 ? (
              <p className="text-gray-500">No hay menús disponibles.</p>
            ) : (
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                {noAsignados.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-3 bg-gray-50 border rounded-lg px-3 py-2 hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={seleccionNoAsignados.includes(m.id)}
                      onChange={() => toggleSeleccionNoAsignado(m.id)}
                    />
                    <div>
                      <p className="font-medium">{m.nombre}</p>
                      <p className="text-sm text-gray-600">
                        {m.url || "—"} ({m.esSubmenu ? "Submenú" : "Menú"})
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <button
              onClick={handleAsignar}
              className="mt-4 bg-[#1A2E81] text-white px-5 py-2 rounded hover:scale-105 transition"
            >
              Asignar seleccionados
            </button>
          </div>
        </div>
      )}

      {/* MODAL PARA REMOVER */}
      {confirmRemoveOpen && (
        <DeleteConfirmationModal
          isOpen={confirmRemoveOpen}
          onClose={() => setConfirmRemoveOpen(false)}
          onConfirm={handleRemover}
          itemName="los permisos seleccionados"
        />
      )}
    </div>
  );
}
