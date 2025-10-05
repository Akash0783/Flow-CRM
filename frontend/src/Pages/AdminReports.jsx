import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import toast from "react-hot-toast";
import Loader from "./Loaders";

// Reusable Card
const ReportCard = ({ title, value, color }) => (
  <div className={`bg-white rounded-2xl shadow-lg p-6 border-t-4 ${color}`}>
    <p className="text-gray-600 font-semibold">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

const AdminReports = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    newLeads: 0,
    inProgressLeads: 0,
    convertedLeads: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
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
        const newLeads = leads.filter(l => l.status?.toLowerCase() === "new").length;
        const inProgressLeads = leads.filter(l => l.status?.toLowerCase() === "in progress").length;
        const convertedLeads = leads.filter(l => l.status?.toLowerCase() === "converted").length;

        setStats({
          totalInvoices: invoices.length,
          paidInvoices: paidInvoices.length,
          pendingInvoices: pendingInvoices.length,
          totalRevenue,
          pendingRevenue,
          newLeads,
          inProgressLeads,
          convertedLeads,
        });
      } catch (err) {
        console.error("Reports fetch error:", err.response?.data || err.message);
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <Loader />;

  return (
     <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar />
    <div className="flex-1 flex flex-col p-8 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Admin Reports</h2>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportCard title="Total Invoices" value={stats.totalInvoices} color="border-blue-600" />
        <ReportCard title="Paid Invoices" value={stats.paidInvoices} color="border-green-600" />
        <ReportCard title="Pending Invoices" value={stats.pendingInvoices} color="border-amber-600" />
        <ReportCard title="Total Revenue" value={`₹${stats.totalRevenue}`} color="border-teal-600" />
        <ReportCard title="Pending Revenue" value={`₹${stats.pendingRevenue}`} color="border-red-600" />
        <ReportCard title="New Leads" value={stats.newLeads} color="border-purple-600" />
        <ReportCard title="Leads In Progress" value={stats.inProgressLeads} color="border-indigo-600" />
        <ReportCard title="Converted Leads" value={stats.convertedLeads} color="border-green-700" />
      </section>
    </div>
    </div>
    </div>
  );
};

export default AdminReports;
