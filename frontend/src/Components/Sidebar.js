import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Contact, Settings, LogOut, UserCog, SlidersHorizontal } from "lucide-react";
import api from "../api";  // ✅ axios instance with baseURL + token

const navItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
  { name: "Customers", path: "/customers", icon: <Users size={20} /> },
  { name: "Invoices", path: "/invoices", icon: <FileText size={20} /> },
  { name: "Leads", path: "/leads", icon: <Contact size={20} /> },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/auth/me"); // ✅ endpoint to get current logged in user
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
      }
    };
    loadUser();
  }, []);

  return (
    <aside className={`h-screen bg-white shadow-sm flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Brand + Collapse Button */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h1 className="text-xl font-bold text-teal-700">Flow CRM</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-100 transition"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        {!collapsed && (
          <div>
            <p className="font-medium">{user?.name || "Loading..."}</p>
            <p className="text-sm text-gray-500">{user?.role || "User"}</p>
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-4 py-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 bg-gray-100 rounded focus:outline-none focus:ring focus:ring-teal-300 transition"
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                ${active
                  ? "bg-teal-50 text-teal-700 font-medium shadow-sm"
                  : "hover:bg-gray-100 hover:text-teal-600"}
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Links */}
      <div className="p-4 border-t space-y-2">
        <Link to="/profile" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
          <UserCog size={20} />
          {!collapsed && <span>Profile</span>}
        </Link>

        <Link to="/preferences" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
          <SlidersHorizontal size={20} />
          {!collapsed && <span>Preferences</span>}
        </Link>

        <Link to="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </Link>

        <Link to="/logout" className="flex items-center gap-3 px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 transition">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
