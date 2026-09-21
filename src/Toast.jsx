import { useEffect } from "react";
import "./Toast.css";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, type, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === "success" && "✓"}
        {type === "error" && "!"}
        {type === "info" && "i"}
      </div>

      <div className="toast-message">
        {message}
      </div>

      <button
        className="toast-close"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;