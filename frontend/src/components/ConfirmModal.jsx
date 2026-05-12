import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../Redux/modalReducer.js";

export default function ConfirmModal() {
  const dispatch = useDispatch();
  const { isOpen, message } = useSelector((state) => state.modal);

  const handleConfirm = () => {
    if (window.__confirmCallback) {
      window.__confirmCallback();
      window.__confirmCallback = null;
    }
    dispatch(closeModal());
  };

  const handleCancel = () => {
    window.__confirmCallback = null;
    dispatch(closeModal());
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      zIndex: 10000,
    }}>
      <div style={{
        background: "white", padding: "24px", borderRadius: "10px",
        minWidth: "300px", textAlign: "center",
      }}>
        <p style={{ marginBottom: "20px", fontSize: "16px" }}>{message}</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button onClick={handleCancel} style={{ padding: "8px 20px" }}>
            Cancel
          </button>
          <button onClick={handleConfirm} style={{
            padding: "8px 20px", background: "#f44336", color: "white", border: "none", borderRadius: "6px"
          }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}