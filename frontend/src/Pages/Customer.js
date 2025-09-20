import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import api from "../api";

const Customer = ()=>{

    const[Customers, setCustomers] = useState([]);
    const[Loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const API_URL = "http://localhost:5000/api/customers"

    useEffect(()=>{
        const fetchCustomers = async()=>{
            try{
                const token = localStorage.getItem("token")
                const response = await axios.get(API_URL, {
                    headers: {Authorization: `Bearer ${token}`},
                })
                setCustomers(response.data.items)
                console.log("API Response: ", response.data)
            }catch(error){
                console.log("Error Fetching Customers: " + error)
            }finally {
                setLoading(false)
            }
        }
        fetchCustomers();
    }, [])

    if(Loading){
        return <p className="text-gray-600">Loading Customers...</p>
    }

    const handleDelete = async (id)=> {
        const ok = window.confirm("Delete the Customer? This can not be undone")
        if(!ok) return;

        try{
            await api.delete(`customers/${id}`)
            setCustomers((prev) => prev.filter((c) => c._id !==id))
        }catch(err){
            console.error("Delete error: ", err.response?.data || err.message)
            alert(err.response?.data.error || "Delete Failed")
        }
    }   

    return(
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Customers</h2>
            <button onClick={()=> navigate("/customers/add")} className="bg-blue-500 text-white px-3 py-2 rounded">Add Customer</button>
            </div>
            {Customers.length===0 ? (
                <p className="text-gray-500">No Customers Found.</p>
            ) : (
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p3 border">Name</th>
                            <th className="text-left p3 border">Email</th>
                            <th className="text-left p3 border">Phone</th>
                            <th className="text-left p3 border">Company</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Customers.map((cust)=>(
                            <tr key={cust._id} className="hover:bg-gray-50">
                                <td className="p-3 border">{cust.name}</td>
                                <td className="p-3 border">{cust.email}</td>
                                <td className="p-3 border">{cust.phone}</td>
                                <td className="p-3 border">{cust.company}</td>
                                <td className="p-3 border">
                                    <button onClick={()=> navigate(`/customers/edit/${cust._id}`)} className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                                    <button onClick={()=> handleDelete(cust._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
         
            <p className="text-gray-600">Manage All Customers here.</p>
        </div>
    )
}
export default Customer