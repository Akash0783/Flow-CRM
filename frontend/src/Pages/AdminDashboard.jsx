import { useEffect, useState, useContext } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import api from "../api";
import { AuthContext } from "../Context/AuthContext";

// 🔹 Reusable Stat Card
const StatCard = ({ title, value, borderColor, textColor }) => (
  <div className={`flex-1 min-w-[280px] bg-white rounded-2xl shadow-lg p-8 border-t-8 ${borderColor}`}>
    <p className="text-gray-600 font-semibold text-lg">{title}</p>
    <p className={`text-3xl font-extrabold mt-3 ${textColor}`}>{value}</p>
  </div>
);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    customers: 0,
    invoices: 0,
    leads: 0,
    newLeads: 0,
    inProgressLeads: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 🔹 Customers
        const customersRes = await api.get("/customers");
        const customers = customersRes.data.items ?? customersRes.data ?? [];

        // 🔹 Invoices
        const invoicesRes = await api.get("/invoices");
        const invoices = invoicesRes.data.items ?? invoicesRes.data ?? [];
        const paidInvoices = invoices.filter(inv => ["paid", "success"].includes(inv.status?.toLowerCase()));
        const pendingInvoices = invoices.filter(inv => ["pending", "unpaid"].includes(inv.status?.toLowerCase()));
        const totalRevenue = paidInvoices.reduce((sum, inv) => sum + Number(inv.amount || inv.total || 0), 0);
        const pendingRevenue = pendingInvoices.reduce((sum, inv) => sum + Number(inv.amount || inv.total || 0), 0);

        // 🔹 Leads
        const leadsRes = await api.get("/leads");
        const leads = leadsRes.data.items ?? leadsRes.data ?? [];
        const convertedLeads = leads.filter(l => l.status?.toLowerCase() === "converted").length;
        const newLeads = leads.filter(l => l.status?.toLowerCase() === "new").length;
        const inProgressLeads = leads.filter(l => l.status?.toLowerCase() === "in progress").length;

        // 🔹 Users
        const usersRes = await api.get("/users");
        const users = usersRes.data.items ?? usersRes.data ?? [];

        setStats({
          customers: customers.length,
          invoices: invoices.length,
          leads: convertedLeads,
          newLeads,
          inProgressLeads,
          totalRevenue,
          pendingRevenue,
          paidInvoices: paidInvoices.length,
          pendingInvoices: pendingInvoices.length,
          users: users.length,
        });
      } catch (err) {
        console.error("Admin dashboard fetch error:", err.response?.data || err.message);
        alert("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading Dashboard...</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar />
        <main className="p-8 space-y-14">
          {/* 🔹 Overview Cards */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Overview</h2>
            <div className="flex flex-wrap gap-6">
              <StatCard title="Customers" value={stats.customers} borderColor="border-blue-700" textColor="text-blue-800" />
              <StatCard title="Invoices" value={stats.invoices} borderColor="border-green-700" textColor="text-green-800" />
              <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} borderColor="border-teal-700" textColor="text-teal-800" />
              <StatCard title="Pending Revenue" value={`₹${stats.pendingRevenue}`} borderColor="border-amber-700" textColor="text-amber-800" />
              <StatCard title="Leads (Converted)" value={stats.leads} borderColor="border-purple-700" textColor="text-purple-800" />
              <StatCard title="New Leads" value={stats.newLeads} borderColor="border-orange-700" textColor="text-orange-800" />
              <StatCard title="Leads In Progress" value={stats.inProgressLeads} borderColor="border-indigo-700" textColor="text-indigo-800" />
              <StatCard title="Users" value={stats.users} borderColor="border-pink-700" textColor="text-pink-800" />
            </div>
          </section>

          {/* 🔹 Management Sections */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Customers</h3>
                <p className="text-gray-500">
                  Manage your customer base efficiently. Add new customers, update existing records, or remove outdated entries to keep your CRM up-to-date.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Invoices</h3>
                <p className="text-gray-500">
                  Track and manage all invoices. Create new invoices, update payment status, and review past transactions to maintain financial clarity.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Leads</h3>
                <p className="text-gray-500">
                  Monitor and convert leads effectively. View new leads, follow up on in-progress leads, and track successfully converted leads.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Users</h3>
                <p className="text-gray-500">
                  Manage system users. Assign roles, update user details, or remove users who no longer require access.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Reports</h3>
                <p className="text-gray-500">
                  Access comprehensive reports on revenue, invoices, and leads. Analyze performance and make data-driven decisions for your business.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
