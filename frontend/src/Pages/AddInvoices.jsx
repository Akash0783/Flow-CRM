import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const AddInvoice = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer: "",
    amount: "",
    description: "",
    status: "Pending",
  });
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await api.get("/customers");
        setCustomers(res.data.items ?? res.data ?? []);
      } catch (err) {
        console.error(err);
        alert("Could not load customers");
      } finally {
        setLoadingCustomers(false);
      }
    };
    loadCustomers();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer) return alert("Select a Customer");
    if (!form.amount || Number(form.amount) <= 0)
      return alert("Enter valid amount");

    setSaving(true);
    try {
      await api.post("/invoices", {
        ...form,
        amount: Number(form.amount),
        description: form.description || "General Invoice",
      });
      alert("Invoice created");
      navigate("/invoices");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Could not create invoice");
    } finally {
      setSaving(false);
    }
  };

  return (
     <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar />
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {loadingCustomers ? (
          <p>Loading customers...</p>
        ) : (
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
        )}

        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <input
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
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
          className="w-full p-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        >
          {saving ? "Saving..." : "Create Invoice"}
        </button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default AddInvoice;
