import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import api from "../api";

const Invoices = ()=>{

  const[invoices, setInvoices] = useState([])
  const[loading, setLoading] = useState(true);

  const navigate = useNavigate()

  useEffect(()=>{
    const load = async  ()=> {
    try{
      const res = await api.get("/invoices")

      const items = res.data.items ?? res.data ?? []
      setInvoices(items)
    }catch(err){
      console.error("Error Loading Invoices:", err.response.data || err.message)
      alert("Could not load invoices")
    }finally{
      setLoading(false)
    }
   }
   load()
  }, [])

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this invoice? this cannot be undone")
    if(!ok) return 
    try{
      await api.delete(`/invoices/${id}`)
      setInvoices(prev => prev.filter(inv => inv._id !== id))
    }catch(err){
      console.error("Delete invoice error: ", err.response?.data || err.message)
      alert("Delete Failed")
    }
  }
  if(loading) return <p>Loading Invoices...</p>
  return(
    <div className="bg-white shadow p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Invoices</h1>
         <div>
            <button onClick={()=> navigate("/invoices/add")} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Add Invoices</button>
         </div>
      </div>
      {invoices.length === 0? (
        <p className="text-gray-500">No invoices found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th className="text-left p-3 border">Invoice ID</th>
              <th className="text-left p-3 border">Customer</th>
              <th className="text-left p-3 border">Amount</th>
              <th className="text-left p-3 border">Status</th>
              <th className="text-left p-3 border">Created At</th>
              <th className="text-left p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv =>(
              <tr key={inv._id} className="hover:bg-gray-50">
                <td className="p-3 border">{inv._id.slice(-6)}</td>
                <td className="p-3 border">{inv.customer?.name ?? inv.customer}</td>
                <td className="p-3 border">{inv.amount}</td>
                <td className="p-3 border">{inv.status ?? "Pending"}</td>
                <td className="p-3 border">{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td className="p-3 border space-x-2"><button onClick={()=> navigate(`/invoices/edit/${inv._id}`)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                {<button onClick={()=> handleDelete(inv._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>}</td>                
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    </div>
  )
}
export default Invoices