import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const bellIcon = { path: "icons/bell.svg" };

const Upbar = ({ title }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="flex items-center px-10 justify-between py-4 fixed top-0 left-0 right-0 z-60 lg:ml-48"
      style={{ backgroundColor: "#1A2E81" }}
    >
      {/* TITLE */}
      <span className="heading-4 text-white font-semibold tracking-wide">
        {title}
      </span>

      <div className="flex items-center gap-4 relative">
        {/* 🔔 Notificaciones */}
        <button
          type="button"
          className="flex items-center justify-center focus:outline-none hover:scale-105 transition-transform"
        >
          <img src={bellIcon.path} className="size-7 filter-white" alt="Notificaciones" />
        </button>

        {/* 👤 Usuario + Dropdown */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setOpen(!open)}
        >
          <img
            src="https://randomuser.me/api/portraits/men/20.jpg"
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />

          <div className="flex flex-col leading-none">
            <span className="body-1 text-white font-medium">
              {user?.usuario ?? "Usuario"}
            </span>

            {/* Mostrar el cargo desde roles */}
            <span className="body-3 text-gray-300">
              Rol: {user?.cargo ?? "Sin cargo"}
            </span>
          </div>

          <svg width={20} height={20} fill="none" viewBox="0 0 24 24">
            <path
              d="M6 9l6 6 6-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </svg>
        </div>

        {/* 🔽 Dropdown */}
        {open && (
          <div
            className="absolute right-0 mt-30 w-52 rounded-lg overflow-hidden animate-fadeIn z-50"
            style={{
              backgroundColor: "#243B9D", 
              boxShadow: "0px 6px 20px rgba(0,0,0,0.25)",
              border: "1px solid #1A2E81",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
                setTimeout(() => window.location.reload(), 150);
              }}
              className="
                w-full text-left 
                px-4 py-3 
                text-sm 
                text-white 
                hover:bg-[#1A2E81] 
                transition-all 
                duration-200 
                flex 
                items-center 
                gap-3
              "
            >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.8} 
              stroke="currentColor" 
              className="h-5 w-5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3" 
              />
            </svg>
              Cerrar sesión
            </button>

          </div>
        )}


      </div>
    </header>
  );
};

export default Upbar;
