import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-gray-700">Welcome, {user.username}</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-500">{user.role.toUpperCase()}</span>
      </div>
    </header>
  );
};

export default Navbar;
