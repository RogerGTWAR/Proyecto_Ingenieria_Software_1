const MaterialCardAvailable = ({ material, onDragStart }) => {
  if (!material) return null;

  // Material REAL del backend
  const m =
    material.material_id_materiales ??
    material.original ??
    material;

  const nombre = m.nombre_material ?? "Material";
  const unidad = m.unidad_de_medida ?? "";
  const precio = money(m.precio_unitario ?? 0);
  const stock = num(m.cantidad_en_stock ?? 0);

  const categoria = m.categorias?.nombre_categoria ?? "";
  const imagen = m.imagen ?? null;

  const initials = nombre
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();



  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, material)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-3">
        {imagen ? (
          <img
            src={imagen}
            alt={nombre}
            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-gray-600">
              {initials}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm truncate">{nombre}</h4>

            {categoria && (
              <span className="inline-block px-2 py-1 bg-yellow-100 text-green-800 text-xs font-medium rounded-full capitalize shrink-0 ml-2">
                {categoria}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
            <span>{precio} c/u</span>
            <span>
              {stock} {unidad}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialCardAvailable;
