interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
}

const alertClassByType = {
  success: "alert-success",
  error: "alert-error",
  info: "alert-info",
};

export const Toast = ({ message, type = "info" }: ToastProps) => {
  return (
    <div className="toast toast-top toast-end z-50">
      <div className={`alert ${alertClassByType[type]} shadow-lg`}>
        <span>{message}</span>
      </div>
    </div>
  );
};
