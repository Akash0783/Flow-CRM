import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { LayoutDashboard, Users, FileText, Contact, LogOut, BarChart2} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Navigation items for both user and admin
  const navItems = [
    { name: "Dashboard", path: user?.role === "admin" ? "/admin" : "/user", icon: <LayoutDashboard size={20} />, roles: ["admin", "user"] },
    { name: "Customers", path: "/customers", icon: <Users size={20} />, roles: ["admin", "user"] },
    { name: "Invoices", path: "/invoices", icon: <FileText size={20} />, roles: ["admin", "user"] },
    { name: "Leads", path: "/leads", icon: <Contact size={20} />, roles: ["admin", "user"] },
    // Admin only items
    { name: "Users", path: "/admin/users", icon: <Users size={20} />, roles: ["admin"] },
    { name: "Reports", path: "/admin/reports", icon: <BarChart2 size={20} />, roles: ["admin"] },
  ];

  return (
    <aside
      className={`bg-gray-900 text-gray-100 h-screen flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand + Collapse Button */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <span className={`text-xl font-bold transition-all duration-300 ${collapsed ? "hidden" : "block"}`}>
          Flow-CRM
        </span>
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400">
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {navItems
          .filter(item => item.roles.includes(user?.role))
          .map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition ${
                  active ? "bg-gray-800 font-semibold" : ""
                }`}
              >
                {item.icon}
                <span className={`transition-all duration-300 ${collapsed ? "hidden" : "block"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-gray-800 transition text-red-500"
        >
          <LogOut size={20} />
          <span className={`${collapsed ? "hidden" : "block"}`}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
