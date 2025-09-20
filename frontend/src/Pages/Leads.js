import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Leads = ()=>{
    const [leads, setLeads] = useState([])

    useEffect(()=>{
        fetchLeads()
    }, [])

    const fetchLeads = async () => {
        try{
            const token = localStorage.getItem("token")
            const res = await axios.get("http://localhost:5000/api/leads", 
                {
                    headers : {Authorization :`Bearer ${token}`,},
                }
            )
            setLeads(res.data.items)
        }catch(err){
            console.error(err)
        }
    }

    const handleDelete = async(id)=>{
        try{
            const token = localStorage.getItem("token")
            await axios.delete(`http://localhost:5000/api/leads/${id}`, 
                {
                    headers : {Authorization : `Bearer ${token}`,},
                }
            )
            setLeads(leads.filter((lead)=> lead._id !==id))
        }catch(err){
            console.error(err)
        }
    }
    return(
        <div className="bg-white shadow p-6 rounded-lg">
            <h1 className="text-xl font-bold mb-4">Leads</h1>
            <Link to = "/leads/add" className="mb-4 bg-green-500 text-white px-4 py-2 rounded inline-block">Add New Lead</Link>
            {leads.length === 0? (
                <p className="text-gray-500 mt-4">No Leads Found...</p>
            ):(
            <table className="w-full border  border-gray-300" border={1} cellPadding={10}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead)=>(
                        <tr key={lead._id}>
                            <td>{lead.name}</td>
                            <td>{lead.email}</td>
                            <td>{lead.phone}</td>
                            <td>{lead.status}</td>
                            <td><Link to={`/leads/edit/${lead._id}`} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 inline-block">
                                   Edit
                                </Link> {" | "} <button onClick={()=>handleDelete(lead._id)}  className="bg-red-500 text-white px-3 py-1 rounded" >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>
    )
}
export default Leads