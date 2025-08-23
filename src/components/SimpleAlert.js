// components/SimpleAlert.js
import { Alert } from "react-bootstrap";
import { useAlert } from "../context/AlertContext";

const SimpleAlert = () => {
  const { alert, hideAlert } = useAlert();

  if (!alert) return null;

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
      <Alert
        variant={alert.type}
        onClose={hideAlert}
        dismissible
        className="m-0"
      >
        {alert.message}
      </Alert>
    </div>
  );
};

export default SimpleAlert;
