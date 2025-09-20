import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"

const AddInvoices = ()=>{

    const navigate = useNavigate()
    const[customers, setCustomers] = useState([])
    const[form, setForm] = useState({customer : "", amount: "", description: "", status: "Pending"})
    const[loadingCustomers, setLoadingCustomers] = useState(true)
    const[saving, setSaving] = useState(false)

    useEffect(()=>{
        const loadCustomers = async ()=>{
            try{
                const res = await api.get("/customers")
                const items = res.data.items ?? res.data ?? []
                setCustomers(items)
            }catch(err){
                console.error("Load Custommers error: ", err.response?.data || err.message)
                alert("Could not load the customers")
            }finally{
                setLoadingCustomers(false)
            }
        }
        loadCustomers()
    }, [])

    const handleChange = (e)=> setForm(prev => ({
        ...prev, [e.target.name] : e.target.value
    }))

    const handleSubmit = async (e)=>{
        e.preventDefault()

        if(!form.customer) return alert("Select a Customer")
        if(!form.amount || Number(form.amount) <= 0 ) return alert("Enter valid amount")

        try{
            setSaving(true)
            const payload  = {
                customer : form.customer,
                amount : Number(form.amount),
                description : form.description || "General Invoice",
                status : form.status,
            }
            const res = await api.post("/invoices", payload)
            alert("Invoice created")
            navigate("/invoices")
        }catch(err){
            console.error("Create invoice error: ", err.response?.data || err.message)
            alert(err.response?.data?.error || "Could not Create Invoice")
        }finally{
            setSaving(false)
        }
    }
    return(
            <div className="bg-white p-6 rounded-lg shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Invoice</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">Customer</span>
          {loadingCustomers ? (
            <p>Loading customers...</p>
          ) : (
            <select name="customer" value={form.customer} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Select Customer --</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>{c.name} — {c.company ?? ""}</option>
              ))}
            </select>
          )}
        </label>

        <label className="block">
          <span className="text-sm">Amount</span>
          <input name="amount" value={form.amount} onChange={handleChange} type="number" step="0.01" placeholder="Amount" className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          <span className="text-sm">Description</span>
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description (optional)" className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          <span className="text-sm">Status</span>
          <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">
            {saving ? "Saving..." : "Create Invoice"}
          </button>
          <button type="button" onClick={() => navigate("/invoices")} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddInvoices