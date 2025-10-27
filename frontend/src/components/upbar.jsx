const bellIcon = { path: "icons/bell.svg" };

const Upbar = ({ title }) => {
  return (
    <header
      className="flex items-center px-10 justify-between py-4 fixed top-0 left-0 right-0 z-60 lg:ml-48"
      style={{ backgroundColor: "#1A2E81" }} 
    >
      <span className="heading-4 text-white font-semibold tracking-wide">
        {title}
      </span>

      <div className="flex items-center gap-4">
        {/* Botón campana notificaciones */}
        <button
          type="button"
          className="flex items-center justify-center focus:outline-none hover:scale-105 transition-transform"
        >
          <img src={bellIcon.path} className="size-7 filter-white" alt="Notificaciones" />
        </button>

        {/* Usuario */}
        <div className="flex items-center gap-2">
          <img
            src="https://randomuser.me/api/portraits/men/20.jpg"
            alt="Roger Perez"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <div className="flex flex-col leading-none">
            <span className="body-1 text-white font-medium">User test</span>
            <span className="body-3 text-gray-300">user@gmail.com</span>
          </div>
          <svg width={20} height={20} fill="none" viewBox="0 0 24 24">
            <path
              d="M6 9l6 6 6-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Upbar;
