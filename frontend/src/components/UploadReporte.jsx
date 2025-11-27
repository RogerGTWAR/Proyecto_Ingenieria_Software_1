import { useState } from "react";
import { reportesService } from "../services/reportesService";

export default function UploadReporte({ usuarioId }) {

  const [file, setFile] = useState(null);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("PDF");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Seleccione un archivo");

    const form = new FormData();
    form.append("usuario_id", usuarioId);
    form.append("nombre_reporte", nombre);
    form.append("tipo_reporte", tipo);
    form.append("descripcion", descripcion);
    form.append("archivo", file);

    const resp = await reportesService.crear(form);

    if (resp.ok) {
      alert("Reporte registrado");
      setNombre("");
      setDescripcion("");
      setFile(null);
    } else {
      alert(resp.msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-3">Subir reporte</h2>

      <input
        type="text"
        placeholder="Nombre del reporte"
        className="border p-2 w-full mb-3"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-3"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option>PDF</option>
        <option>EXCEL</option>
      </select>

      <textarea
        placeholder="Descripción"
        className="border p-2 w-full mb-3"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <input
        type="file"
        className="mb-3"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Guardar reporte
      </button>
    </form>
  );
}
