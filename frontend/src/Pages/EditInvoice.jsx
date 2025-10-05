import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer: "",
    amount: "",
    description: "",
    status: "Pending",
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadInvoiceAndCustomers = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch invoice
        const invoiceRes = await api.get(`/invoices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const invoice = invoiceRes.data;

        // Fetch customers
        const customersRes = await api.get("/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const customerList = customersRes.data.items ?? customersRes.data ?? [];

        setForm({
          customer: invoice.customer?._id ?? invoice.customer ?? "",
          amount: invoice.amount ?? "",
          description: invoice.description ?? "",
          status: invoice.status ?? "Pending",
        });
        setCustomers(customerList);
      } catch (err) {
        console.error("Load invoice/customers error", err.response?.data || err.message);
        alert("Failed to load invoice or customers");
        navigate("/invoices");
      } finally {
        setLoading(false);
      }
    };

    loadInvoiceAndCustomers();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await api.put(`/invoices/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Invoice updated successfully!");
      navigate("/invoices");
    } catch (err) {
      console.error("Update error", err.response?.data || err.message);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
     <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar />
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="customer"
          value={form.customer}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        >
          <option value="">-- Select Customer --</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} — {c.company ?? ""}
            </option>
          ))}
        </select>

        <input
          name="amount"
          type="number"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button
          type="submit"
          disabled={saving}
          className="w-full p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default EditInvoice;
