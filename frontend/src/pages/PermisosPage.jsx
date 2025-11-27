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

  const [usuarioBuscado, setUsuarioBuscado] = useState("");
  const [seleccionAsignados, setSeleccionAsignados] = useState([]);
  const [seleccionNoAsignados, setSeleccionNoAsignados] = useState([]);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const handleBuscarUsuario = async () => {
    if (!usuarioBuscado.trim()) return alert("Ingrese un usuario.");

    const emp = await buscar(usuarioBuscado.trim());
    if (!emp) return;

    await loadMenus();
    await loadAsignados(emp.usuario_id);
    await loadNoAsignados(emp.usuario_id);
  };

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

  const handleAsignar = async () => {
    if (!empleado) return alert("No se encontró usuario.");
    if (seleccionNoAsignados.length === 0)
      return alert("Debe seleccionar al menos un menú.");

    await asignar(empleado.usuario_id, seleccionNoAsignados);
    setSeleccionNoAsignados([]);
  };

  const confirmarRemover = () => {
    if (seleccionAsignados.length === 0)
      return alert("Debe seleccionar al menos un menú.");
    setConfirmRemoveOpen(true);
  };

  const handleRemover = async () => {
    await remover(empleado.usuario_id, seleccionAsignados);
    setSeleccionAsignados([]);
    setConfirmRemoveOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="heading-1 text-[var(--color-primary)] mb-2">
        Gestión de Permisos
      </h1>

      <p className="body-1 text-[var(--color-gray)] mb-6">
        Asigna o remueve acceso a los módulos del sistema.
      </p>

      <div className="bg-white rounded-xl shadow p-4 mb-8 flex items-center gap-4">
        <input
          type="text"
          placeholder="Ingrese el usuario..."
          value={usuarioBuscado}
          onChange={(e) => setUsuarioBuscado(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
        />

        <button
          onClick={handleBuscarUsuario}
          className="px-5 py-2 bg-[#1A2E81] text-white rounded-lg hover:scale-105 transition"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {empleado && (
        <div className="bg-white rounded-xl shadow p-4 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
            Usuario encontrado
          </h2>

          <p className="text-gray-700">
            <strong>Nombre completo: </strong>
            {empleado.empleados?.nombres} {empleado.empleados?.apellidos}
          </p>

          <p className="text-gray-700">
            <strong>Usuario: </strong>
            {empleado.usuario}
          </p>

          <p className="text-gray-700">
            <strong>Rol: </strong>
            {empleado.empleados?.roles?.cargo ?? "—"}
          </p>
        </div>
      )}

      {empleado && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
