const DataTable = ({ headers, data, buttons }) => {
  const hasActions = buttons && buttons.length > 0;

  const getButtonClass = (style) => {
    switch (style) {
      case "primary":
        return "bg-primary text-white px-3 py-1 rounded hover:scale-105";
      case "secondary":
        return "bg-secondary text-white px-3 py-1 rounded hover:scale-105";
      default:
        return "bg-gray text-white px-3 py-1 rounded hover:scale-105";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-max w-full bg-white rounded-2xl drop-shadow-sm drop-shadow-black/40 my-4 border-separate border-spacing-y-2">
        <thead className="text-[var(--color-primary)] font-bold">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left whitespace-nowrap"
              >
                {header}
              </th>
            ))}
            {hasActions && <th className="px-4 py-2 text-left">Acciones</th>}
          </tr>
        </thead>

            <tbody>
  {data.map((row, index) => (
    <tr
      key={row.id || index}
      className={`${index % 2 === 0 ? "bg-[var(--color-fifth)]" : "bg-white"}`}
    >
      {headers.map((header, colIndex) => (
        <td
          key={colIndex}
          className={`px-4 py-2 text-[var(--color-secondary)] whitespace-nowrap
            ${colIndex === 0 ? "rounded-l-full" : ""}
            ${colIndex === headers.length - 1 && !hasActions ? "rounded-r-full" : ""}`}
        >
          {row[header]}
        </td>
      ))}
      {hasActions && (
        <td className="px-4 py-2 whitespace-nowrap rounded-r-full">
          <div className="flex gap-2 items-center">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                className={getButtonClass(btn.style)}
                onClick={() => btn.action(row)}
              >
                {btn.name}
              </button>
            ))}
          </div>
        </td>
      )}
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default DataTable;
