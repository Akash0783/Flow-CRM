import { useState } from "react";
import api from "../api";

const AddCust = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post("customers",
        { name, email, phone, company },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Customer Added Successfully");
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
    } catch (err) {
      console.error(err);
      alert("Check Customer Details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="text"
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          type="text"
          placeholder="Company"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        >
          {loading ? "Adding..." : "Add Customer"}
        </button>
      </form>
    </div>
  );
};

export default AddCust;
