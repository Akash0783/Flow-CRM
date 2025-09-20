import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer: "",
    amount: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/invoices/${id}`);
        const data = res.data;

        setFormData({
          customer: data.customer?._id ?? data.customer ?? "",
          amount: data.amount ?? "",
          status: data.status ?? "Pending",
        });
      } catch (err) {
        console.error("Error fetching invoice:", err.response?.data || err.message);
        alert("Could not load invoice");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/invoices/${id}`, formData);
      alert("Invoice updated successfully");
      navigate("/invoices");
    } catch (err) {
      console.error("Error updating invoice:", err.response?.data || err.message);
      alert("Update failed");
    }
  };

  if (loading) return <p>Loading invoice...</p>;

  return (
    <div className="bg-white shadow p-6 rounded-lg max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer ID */}
        <input
          type="text"
          name="customer"
          placeholder="Customer ID"
          value={formData.customer}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Status */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Save */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInvoice;
