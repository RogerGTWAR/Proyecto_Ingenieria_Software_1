import React, { useEffect, useState } from "react";
import AppAlertModal from "./AppAlertModal";

const initialState = {
  open: false,
  type: "error",
  title: "",
  message: "",
};

export default function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState(initialState);

  useEffect(() => {
    const handleAppAlert = (event) => {
      const detail = event.detail || {};

      setAlertState({
        open: true,
        type: detail.type || "error",
        title: detail.title || "Aviso",
        message: detail.message || "",
      });
    };

    window.addEventListener("app-alert", handleAppAlert);

    return () => {
      window.removeEventListener("app-alert", handleAppAlert);
    };
  }, []);

  const closeAlert = () => {
    setAlertState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <>
      {children}

      <AppAlertModal
        open={alertState.open}
        alertData={alertState}
        onClose={closeAlert}
      />
    </>
  );
}