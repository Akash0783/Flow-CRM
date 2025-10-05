import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../Components/Navbar"
import api from "../api"
import Sidebar from "../Components/Sidebar"

const AddLeads = ()=>{

    const navigate = useNavigate()
    const [formData, setformData] = useState({name: "", email: "", phone: "", status: ""})

    const handleChange = (e)=>{
        setformData({...formData, [e.target.name]:e.target.value})
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            const token = localStorage.getItem("token")
            await api.post("/leads", formData,{
                headers : { Authorization: `Bearer ${token}`, "Content-Type" : "application/json"}
            })
            navigate("/leads")
        }catch(err){
            console.error(err)
        }
    }

    return(
         <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar />
        <div className="bg-white shadow p-6 rounded-lg max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Add New Lead</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required  />
                <input type="text" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded" required  />
                <input type="text" placeholder="Email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" required  />
                <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded" required >
                    <option value="">Select Status</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">Qualified</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                </select>
                <button type="submit" className="bg-green-500 text-white p-2 rounded">Add Lead</button>
            </form>
        </div>
        </div>
        </div>
    )
}
export default AddLeads