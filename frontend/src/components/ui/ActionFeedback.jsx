import { useEffect, useState } from "react";

export default function ActionFeedback({ open, message, onClose }) {
  const [render, setRender] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setRender(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 10 + 4; 
        });
      }, 90);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        setRender(false);
        setTimeout(onClose, 400);
      }, 2500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [open]);

  if (!open && !render) return null;

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div
      className={`
        fixed right-8 top-8 z-[99999]
        transition-all duration-[650ms] ease-[cubic-bezier(.18,.89,.32,1.28)]
        ${render ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-90"}
      `}
    >
      <div
        className="
          relative flex items-center gap-4 px-6 py-4 min-w-[330px]
          bg-white/70 backdrop-blur-2xl 
          rounded-3xl border border-white/40
          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
          overflow-hidden
        "
      >
        {progress >= 100 && (
          <div className="absolute inset-0 bg-green-100/40 animate-glow pointer-events-none"></div>
        )}

        <div className="relative w-14 h-14">
          <svg
            className="absolute top-0 left-0"
            width="60"
            height="60"
            viewBox="0 0 60 60"
          >
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="5"
            />
          </svg>

          <svg
            className="absolute top-0 left-0 rotate-[-90deg]"
            width="60"
            height="60"
            viewBox="0 0 60 60"
          >
            <circle
              cx="30"
              cy="30"
              r={radius}
              fill="none"
              stroke="#2563eb"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 0.2s cubic-bezier(.16,1,.3,1)",
              }}
            />
          </svg>

          <svg
            className={`
              absolute top-0 left-0 
              text-green-600
              ${progress >= 100 ? "opacity-100" : "opacity-0"}
            `}
            width="60"
            height="60"
            viewBox="0 0 60 60"
          >
            <path
              d="M18 32 L27 40 L44 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-check"
            />
          </svg>
        </div>

        <div>
          <p className="text-gray-900 font-bold text-[17px]">{message}</p>
          <p className="text-gray-500 text-sm leading-tight">
            Acción completada con éxito
          </p>
        </div>
      </div>

      <style>{`
        .animate-check {
          stroke-dasharray: 70;
          stroke-dashoffset: 70;
          animation: drawCheck 0.6s ease forwards 0.15s;
        }

        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes glow {
          0% { opacity: 0.45; }
          50% { opacity: 0.75; }
          100% { opacity: 0.45; }
        }
        .animate-glow {
          animation: glow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
