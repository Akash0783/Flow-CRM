import { useEffect, useState, useContext } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import api from "../api";
import { AuthContext } from "../Context/AuthContext";
import { Users, FileText, TrendingUp, DollarSign, CheckCircle, Clock } from "lucide-react";

const UserDashboard = () => {
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
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const customersRes = await api.get("/customers");
        const customers =
          customersRes.data.items ||
          customersRes.data.customers ||
          customersRes.data ||
          [];

        const invoicesRes = await api.get("/invoices");
        let invoices =
          invoicesRes.data.items ||
          invoicesRes.data.invoices ||
          invoicesRes.data ||
          [];

        if (user?.role === "user") {
          invoices = invoices.filter(
            (inv) =>
              inv.createdBy === user._id ||
              inv.userId === user._id ||
              inv.owner === user._id
          );
        }

        const leadsRes = await api.get("/leads");
        const leads =
          leadsRes.data.items ||
          leadsRes.data.leads ||
          leadsRes.data ||
          [];

        const paidInvoicesList = invoices.filter(
          (inv) =>
            inv.status?.toLowerCase() === "paid" ||
            inv.status?.toLowerCase() === "success"
        );
        const pendingInvoicesList = invoices.filter(
          (inv) =>
            inv.status?.toLowerCase() === "pending" ||
            inv.status?.toLowerCase() === "unpaid"
        );

        const totalRevenue = paidInvoicesList.reduce(
          (sum, inv) => sum + (Number(inv.amount || inv.total || 0)),
          0
        );
        const pendingRevenue = pendingInvoicesList.reduce(
          (sum, inv) => sum + (Number(inv.amount || inv.total || 0)),
          0
        );

        const convertedLeads = leads.filter(
          (l) => l.status?.toLowerCase() === "converted"
        ).length;
        const newLeads = leads.filter(
          (l) => l.status?.toLowerCase() === "new"
        ).length;
        const inProgressLeads = leads.filter(
          (l) => l.status?.toLowerCase() === "in progress"
        ).length;

        setStats({
          customers: customers.length,
          invoices: invoices.length,
          leads: convertedLeads,
          newLeads,
          inProgressLeads,
          totalRevenue,
          pendingRevenue,
          paidInvoices: paidInvoicesList.length,
          pendingInvoices: pendingInvoicesList.length,
        });
      } catch (err) {
        console.error(
          "Dashboard fetch error:",
          err.response?.data || err.message
        );
      }
    };

    fetchStats();
  }, [user]);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="flex items-center gap-4 bg-white p-7 rounded-xl shadow-md hover:shadow-xl transition w-full md:w-1/3">
      <div className={`p-4 rounded-lg ${color} text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar />
        <main className="p-8 space-y-10">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>

          {/* 🔹 First Row: 3 Cards */}
          <div className="flex flex-wrap gap-6">
            <StatCard
              title="Customers"
              value={stats.customers}
              icon={<Users size={28} />}
              color="bg-blue-500"
            />
            <StatCard
              title="Leads (Converted)"
              value={stats.leads}
              icon={<CheckCircle size={28} />}
              color="bg-purple-500"
            />
            <StatCard
              title="New Leads"
              value={stats.newLeads}
              icon={<TrendingUp size={28} />}
              color="bg-orange-500"
            />
          </div>

          {/* 🔹 Second Row: 2 Cards */}
          <div className="flex flex-wrap gap-6">
            <StatCard
              title="Leads In Progress"
              value={stats.inProgressLeads}
              icon={<Clock size={28} />}
              color="bg-indigo-500"
            />
            <StatCard
              title="Total Invoices"
              value={stats.invoices}
              icon={<FileText size={28} />}
              color="bg-green-500"
            />
          </div>

          {/* 🔹 Third Row: 3 Cards */}
          <div className="flex flex-wrap gap-6">
            <StatCard
              title="Total Revenue (Paid)"
              value={`₹${stats.totalRevenue}`}
              icon={<DollarSign size={28} />}
              color="bg-teal-500"
            />
            <StatCard
              title="Pending Revenue"
              value={`₹${stats.pendingRevenue}`}
              icon={<Clock size={28} />}
              color="bg-amber-500"
            />
            <StatCard
              title="Paid Invoices"
              value={stats.paidInvoices}
              icon={<CheckCircle size={28} />}
              color="bg-emerald-500"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
