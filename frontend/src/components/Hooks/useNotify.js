import { useDispatch } from "react-redux";
import { showNotification } from "../../Redux/notificationReducer.js";  

export default function useNotify() {
  const dispatch = useDispatch();

  return {
    success: (message) => dispatch(showNotification({ message, type: "success" })),
    error: (message) => dispatch(showNotification({ message, type: "error" })),
    info: (message) => dispatch(showNotification({ message, type: "info" })),
  };
}