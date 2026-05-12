import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideNotification } from "../Redux/notificationReducer.js"; 
export default function Notification() {
  const dispatch = useDispatch();
  const { message, type, visible } = useSelector((state) => state.notification);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => dispatch(hideNotification()), 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const colors = {
    success: "#4caf50",
    error: "#f44336",
    info: "#2196f3",
  };
  
  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      background: colors[type] || colors.info,
      color: "white",
      padding: "12px 20px",
      borderRadius: "8px",
      zIndex: 9999,
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      minWidth: "250px",
    }}>
      {message}
    </div>
  );
}