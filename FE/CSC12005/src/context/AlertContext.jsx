import { createContext, useContext, useState, useCallback } from "react";

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback(
    (type, message, duration = 5000) => {
      setAlert({ type, message, duration });
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used inside AlertProvider");
  }
  return context;
};
