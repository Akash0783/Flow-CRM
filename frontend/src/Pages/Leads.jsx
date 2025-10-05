import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import api from "../api";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "./Loaders";

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get("/leads");
        const items = res.data.items ?? res.data ?? [];
        setLeads(items);
      } catch (err) {
        console.error("Error fetching leads:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this lead? This cannot be undone.");
    if (!ok) return;

    try {
      await api.delete(`/leads/${id}`);
      setLeads((prev) => prev.filter((lead) => lead._id !== id));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      toast.error("Delete Failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Qualified":
        return "bg-purple-100 text-purple-800";
      case "Converted":
        return "bg-green-100 text-green-800";
      case "Lost":
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
            <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
            <button
              onClick={() => navigate("/leads/add")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition"
            >
              Add Lead
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : leads.length === 0 ? (
            <p className="text-gray-500">No Leads found.</p>
          ) : (
            <div className="overflow-auto rounded-lg shadow border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead, idx) => (
                    <tr
                      key={lead._id}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{lead.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{lead.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{lead.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          onClick={() => navigate(`/leads/edit/${lead._id}`)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-3 py-1 rounded flex items-center justify-center transition shadow"
                          title="Edit Lead"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="flex items-center justify-center gap-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded-full shadow-md transform hover:scale-105 transition"
                          title="Delete Lead"
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

export default Leads;
