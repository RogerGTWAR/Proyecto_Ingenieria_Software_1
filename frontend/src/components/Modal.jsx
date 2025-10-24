function Modal({ isOpen, onClose, title, children, onSubmit }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-start justify-center pt-20 z-50" onClick={handleBackdropClick}>
      <div className="bg-fifth rounded-lg shadow-lg shadow-black max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto relative">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="heading-3 text-[var(--color-primary)]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {children}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-secondary)] transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;