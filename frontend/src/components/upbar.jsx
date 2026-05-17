import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const bellIcon = { path: "/icons/bell.svg" };

const Upbar = ({ title }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = (e) => {
    e.stopPropagation();
    logout();
    setTimeout(() => window.location.reload(), 150);
  };

  return (
    <header
      className="
        fixed
        left-0
        right-0
        top-0
        z-[60]
        flex
        h-16
        items-center
        justify-between
        border-b
        border-white/10
        bg-gradient-to-r
        from-slate-950
        via-blue-950
        to-cyan-900
        px-4
        shadow-lg
        backdrop-blur
        sm:px-6
        lg:left-48
        lg:px-8
      "
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-cyan-100">
          Panel Administrativo
        </p>

        <h1 className="truncate text-sm font-bold text-white">
          {title}
        </h1>
      </div>

      <div className="relative flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-2xl
            border
            border-white/10
            bg-white/10
            shadow-sm
            transition
            hover:bg-white/20
            focus:outline-none
            focus:ring-4
            focus:ring-cyan-400/20
          "
          aria-label="Notificaciones"
        >
          <img
            src={bellIcon.path}
            className="h-5 w-5 brightness-0 invert"
            alt="Notificaciones"
          />
        </button>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-white/10
            bg-white/10
            px-2
            py-2
            text-left
            shadow-sm
            transition
            hover:bg-white/20
            focus:outline-none
            focus:ring-4
            focus:ring-cyan-400/20
            sm:px-3
          "
        >
          <img
            src="https://randomuser.me/api/portraits/men/20.jpg"
            alt="Avatar"
            className="
              h-9
              w-9
              rounded-2xl
              border
              border-white/40
              object-cover
              shadow-sm
            "
          />

          <div className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="max-w-[180px] truncate text-sm font-bold text-white">
              {user?.usuario ?? "Usuario"}
            </span>

            <span className="max-w-[180px] truncate text-sm text-cyan-100">
              Rol: {user?.cargo ?? "Sin cargo"}
            </span>
          </div>

          <svg
            width={18}
            height={18}
            fill="none"
            viewBox="0 0 24 24"
            className={`
              shrink-0
              transition-transform
              duration-200
              ${open ? "rotate-180" : ""}
            `}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <div
            className="
              absolute
              right-0
              top-14
              w-64
              overflow-hidden
              rounded-3xl
              border
              border-slate-700
              bg-slate-900
              shadow-2xl
              animate-fadeIn
            "
          >
            <div className="border-b border-slate-700 bg-slate-800 px-4 py-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/men/20.jpg"
                  alt="Avatar"
                  className="
                    h-11
                    w-11
                    rounded-2xl
                    border
                    border-white/30
                    object-cover
                  "
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">
                    {user?.usuario ?? "Usuario"}
                  </p>

                  <p className="truncate text-sm text-cyan-100">
                    {user?.cargo ?? "Sin cargo"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                w-full
                items-center
                gap-3
                px-4
                py-3
                text-left
                text-sm
                font-bold
                text-red-100
                transition
                hover:bg-red-600
                hover:text-white
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