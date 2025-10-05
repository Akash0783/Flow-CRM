import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import api from "../api";
import { Edit, Loader, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Loaders from "./Loaders";
const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers");
        const items = res.data.items ?? res.data ?? [];
        setCustomers(items);
      } catch (err) {
        console.error(err.response?.data || err.message);
        toast.error("Could not load customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this customer? This cannot be undone.");
    if (!ok) return;

    try {
      await api.delete(`/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Delete Failed");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
            <button
              onClick={() => navigate("/customers/add")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition"
            >
              Add Customer
            </button>
          </div>

          {loading ? (
            <Loaders />
          ) : customers.length === 0 ? (
            <p className="text-gray-500">No Customers Found.</p>
          ) : (
            <div className="overflow-auto rounded-lg shadow border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((cust, idx) => (
                    <tr key={cust._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{cust.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cust.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cust.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cust.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          onClick={() => navigate(`/customers/edit/${cust._id}`)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-3 py-1 rounded flex items-center justify-center transition shadow"
                          title="Edit Customer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cust._id)}
                          className="flex items-center justify-center gap-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 rounded-full shadow-md transform hover:scale-105 transition"
                          title="Delete Customer"
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

export default Customers;
