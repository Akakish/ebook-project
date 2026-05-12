import { useDispatch } from "react-redux";
import { openModal } from "../../Redux/modalReducer.js";

export default function useConfirm() {
  const dispatch = useDispatch();

  const confirm = (message, callback) => {
    window.__confirmCallback = callback;
    dispatch(openModal({ message }));
  };

  return confirm;
}