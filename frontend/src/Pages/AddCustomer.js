import { useState } from "react"
import axios from "axios"

const AddCust = ()=>{
    const [name, setName] = useState("")
    const[email, setEmail] = useState("")
    const[phone, setPhone] = useState("")
    const[company, setCompany] = useState("")

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const token = localStorage.getItem("token")
            await axios.post(
                "http://localhost:5000/api/customers",
                {name, email, phone, company},
                {headers : {Authorization: `Bearer ${token}`}}
            )
            alert("Customer Added Successfully")
        
        }catch(err){
            console.error(err);
            alert("Check Customer Details")
            console.log(err.response?.data || err.message)
        }
    }
    return(
        <div className="bg-white p-6 rounded-lg shadow mx-auto">
            <h1 className="text-xl font-bold mb-4">Add Customer</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder="Name" className="border p-2 w-full rounded" />
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" className="border p-2 w-full rounded" />
                <input value={phone} onChange={(e)=>setPhone(e.target.value)} type="text" placeholder="Phone Number" className="border p-2 w-full rounded" />
                <input value={company} onChange={(e)=>setCompany(e.target.value)} type="text" placeholder="Company" className="border p-2 w-full rounded" />              
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Add Customer</button>
            </form>
        </div>
    )
}
export default AddCust