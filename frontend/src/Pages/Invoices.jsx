import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import api from "../api";
import { Edit, Trash2 } from "lucide-react";

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await api.get("/invoices");
        const items = res.data.items ?? res.data ?? [];
        setInvoices(items);
      } catch (err) {
        console.error("Error Loading Invoices:", err.response?.data || err.message);
        alert("Could not load invoices");
      } finally {
        setLoading(false);
      }
    };
    loadInvoices();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this invoice? This cannot be undone.");
    if (!ok) return;

    try {
      await api.delete(`/invoices/${id}`);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
    } catch (err) {
      console.error("Delete invoice error: ", err.response?.data || err.message);
      alert("Delete Failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
            <button
              onClick={() => navigate("/invoices/add")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition"
            >
              Add Invoice
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading Invoices...</p>
          ) : invoices.length === 0 ? (
            <p className="text-gray-500">No invoices found.</p>
          ) : (
            <div className="overflow-auto rounded-lg shadow border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((inv, idx) => (
                    <tr
                      key={inv._id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{inv._id.slice(-6)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{inv.customer?.name ?? inv.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-semibold">${inv.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(inv.status)}`}>
                          {inv.status ?? "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          onClick={() => navigate(`/invoices/edit/${inv._id}`)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-3 py-1 rounded flex items-center justify-center transition shadow"
                          title="Edit Invoice"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(inv._id)}
                          className="flex items-center justify-center gap-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded-full shadow-md transform hover:scale-105 transition"
                          title="Delete Invoice"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Invoices;
