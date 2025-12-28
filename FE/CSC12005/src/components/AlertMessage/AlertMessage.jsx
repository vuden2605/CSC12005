import { useEffect } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useAlert } from "../../context/AlertContext";
import "./style.scss";

const AlertMessage = () => {
  const { alert, hideAlert } = useAlert();

  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      hideAlert();
    }, alert.duration || 3000);

    return () => clearTimeout(timer);
  }, [alert, hideAlert]);

  if (!alert) return null;

  return (
    <div className="alert-container">
      <Alert severity={alert.type} onClose={hideAlert}>
        <AlertTitle>
          {alert.type === "success" && "Thành công"}
          {alert.type === "error" && "Lỗi"}
          {alert.type === "warning" && "Cảnh báo"}
          {alert.type === "info" && "Thông tin"}
        </AlertTitle>
        {alert.message}
      </Alert>
    </div>
  );
};

export default AlertMessage;
