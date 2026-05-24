import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../Redux/modalReducer.js";
import "../Styles/Modal.css";

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
    <div className="modal-overlay confirm-modal">
      <div className="modal-content">
        <div className="modal-body">
          <span className="confirm-icon warning">⚠️</span>
          <p className="confirm-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-secondary" onClick={handleCancel}>
            Отмена
          </button>
          <button className="modal-btn modal-btn-danger" onClick={handleConfirm}>
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}
