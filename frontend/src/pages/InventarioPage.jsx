import { useState } from "react";
import DataTable from "../components/DataTable";
import ButtonList from "../components/ButtonList";
import Modal from "../components/Modal";
import { mockDb } from "../../data/mockDb";

function ProductosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoriaId: "",
    nombreProducto: "",
    descripcion: "",
    unidadDeMedida: "",
    cantidadEnStock: 0,
    precioUnitario: "",
  });

  // 🔹 Encabezados de la tabla
  const tableHeaders = ["Nombre", "Categoría", "Unidad", "Stock", "Precio (C$)"];

  // 🔹 Datos de productos usando mockDb
  const tableData = mockDb.productos.map((producto) => ({
    id: producto.productoId,
    Nombre: producto.nombreProducto,
    Categoría:
      mockDb.categorias.find((c) => c.categoriaId === producto.categoriaId)
        ?.nombreCategoria || "N/A",
    Unidad: producto.unidadDeMedida,
    Stock: producto.cantidadEnStock,
    "Precio (C$)": Number(producto.precioUnitario).toLocaleString("es-NI", {
      style: "currency",
      currency: "NIO",
      minimumFractionDigits: 2,
    }),
  }));

  // 🔘 Botones superiores
  const buttons = [
    {
      id: "filter",
      name: "Filtrar",
      icon: "/icons/filter.svg",
      coordinate: 3,
      action: () => console.log("Filtro de productos"),
    },
    {
      id: "add",
      name: "Añadir Producto",
      icon: "/icons/add.svg",
      coordinate: 4,
      action: () => setIsModalOpen(true),
    },
  ];

  // 🧩 Control de formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Nuevo producto agregado:", formData);
    // Aquí iría la lógica para guardar el producto en la base de datos
    setIsModalOpen(false);
    setFormData({
      categoriaId: "",
      nombreProducto: "",
      descripcion: "",
      unidadDeMedida: "",
      cantidadEnStock: 0,
      precioUnitario: "",
    });
  };

  // 🧾 Render principal
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        {/* 🔹 Título y descripción */}
        <div>
          <h1 className="heading-1 text-[var(--color-primary)] mb-2">
            Productos
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Gestión de productos registrados
          </p>
        </div>

        {/* 🔘 Botones de acción */}
        <ButtonList buttons={buttons} />

        {/* 📋 Tabla de productos */}
        <DataTable headers={tableHeaders} data={tableData} />

        {/* 🧾 Modal para agregar nuevo producto */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Añadir Nuevo Producto"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            {/* Categoría */}
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">
                Categoría
              </label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              >
                <option value="">Seleccionar categoría</option>
                {mockDb.categorias.map((categoria) => (
                  <option key={categoria.categoriaId} value={categoria.categoriaId}>
                    {categoria.nombreCategoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre del producto */}
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">
                Nombre del Producto
              </label>
              <input
                type="text"
                name="nombreProducto"
                value={formData.nombreProducto}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                rows="3"
              />
            </div>

            {/* Unidad y stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">
                  Unidad de Medida
                </label>
                <select
                  name="unidadDeMedida"
                  value={formData.unidadDeMedida}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                >
                  <option value="">Seleccionar unidad</option>
                  <option value="unidad">Unidad</option>
                  <option value="kg">Kilogramo</option>
                  <option value="m³">Metro cúbico</option>
                  <option value="m²">Metro cuadrado</option>
                  <option value="galón">Galón</option>
                  <option value="litro">Litro</option>
                </select>
              </div>
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">
                  Cantidad en Stock
                </label>
                <input
                  type="number"
                  name="cantidadEnStock"
                  value={formData.cantidadEnStock}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Precio unitario */}
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">
                Precio Unitario (C$)
              </label>
              <input
                type="number"
                name="precioUnitario"
                value={formData.precioUnitario}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default ProductosPage;
