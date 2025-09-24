// Components/Button.js
const Button = ({ children, variant = "primary", onClick, className = "", ...props }) => {
  let base =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1";

  let styles = "";

  switch (variant) {
    case "primary":
      styles =
        "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-blue-300 focus:ring-blue-500";
      break;
    case "success":
      styles =
        "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-green-300 focus:ring-green-500";
      break;
    case "warning":
      styles =
        "bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 shadow-yellow-300 focus:ring-yellow-400";
      break;
    case "danger":
      styles =
        "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-red-300 focus:ring-red-500";
      break;
    case "secondary":
      styles =
        "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 shadow-gray-300 focus:ring-gray-400";
      break;
    default:
      styles = "bg-blue-600 text-white hover:bg-blue-700";
  }

  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
