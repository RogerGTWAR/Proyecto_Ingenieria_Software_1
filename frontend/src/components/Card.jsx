const Card = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {title && <h2 className="heading-3 text-[var(--color-primary)] mb-3">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;