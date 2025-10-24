const DataTable = ({ headers, data }) => {
  return (
    <div className="w-full bg-white rounded-2xl drop-shadow-sm drop-shadow-black/40 my-4">
      <div className="grid gap-4 p-4 font-bold text-[var(--color-primary)]" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
        {headers.map((header, index) => (
          <div key={index}>{header}</div>
        ))}
      </div>

      {data.map((row, index) => (
        <div
          key={row.id || index}
          className={`grid gap-4 p-4 rounded-full mx-4 ${index % 2 === 0 ? 'bg-[var(--color-fifth)]' : 'bg-white'}`}
          style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}
        >
          {headers.map((header, colIndex) => (
            <div key={colIndex} className="text-[var(--color-secondary)]">
              {row[header]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DataTable;