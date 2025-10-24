const ButtonList = ({ buttons }) => {
  const leftButtons = buttons.filter(button => button.coordinate === 1 || button.coordinate === 2);
  const rightButtons = buttons.filter(button => button.coordinate === 3 || button.coordinate === 4);

  return (
    <div className="w-full flex py-5">
      <div className="w-1/2 flex items-center justify-start gap-2">
        {leftButtons.map(button => (
          <button
            key={button.id}
            onClick={button.action || (() => {})}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray text-[var(--color-secondary)] drop-shadow-lg drop-shadow-gray transition-colors duration-200 hover:scale-105 font-bold"
          >
            <img src={button.icon} alt={button.name} className="w-5 h-5" />
            <span>{button.name}</span>
          </button>
        ))}
      </div>
      <div className="w-1/2 flex items-center justify-end gap-2">
        {rightButtons.map(button => (
          <button
            key={button.id}
            onClick={button.action || (() => {})}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray text-[var(--color-secondary)] drop-shadow-lg drop-shadow-gray transition-colors duration-200 hover:scale-105 font-bold"
          >
            <img src={button.icon} alt={button.name} className="w-5 h-5" />
            <span>{button.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonList;