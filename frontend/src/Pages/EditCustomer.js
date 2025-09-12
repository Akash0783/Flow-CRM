import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import { useParams } from "react-router-dom"

const EditCustomer = ()=>{

    const {id} = useParams()
    const navigate = useNavigate()

    const [form, setform] =  useState({name: "", email: "", phone: "", company: ""})
    const[loading, setLoading] = useState(true)

    useEffect(()=>{
        const load = async () =>{
            try{
                const res = await api.get(`/customers/${id}`)
                const c = res.data

                setform({name : c.name || "", email : c.email || "", phone : c.phone || "", company : c.company })
            }catch(err){
                console.error("Load Customer error", err.response?.data || err.message)
                alert("Could not Load the Customers")
                navigate("/customers")
            }finally{
                setLoading(false)
            }
        }
        load()
    }, [id, navigate])

    const handleChange = (e)=>{
        setform({
            ...form, [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            await api.put(`customers/${id}`, form)
            alert("Customer Successfully Updated :)")
            navigate("/customers")
        }catch(err){
            console.error("Update error", err.response?.data || err.message)
            alert("Update Failed")
        }
    }

    if(loading) return <p>Loading.....</p>

    return(
        <div className="bg-white p-6 rounded-lg shadow w-96 mx-auto">
            <h2 className="text-xl font-bold mb-4">Edit Customers</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input name="name" value={form.name} placeholder="Name" onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="email" value={form.email} placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="phone" value={form.phone} placeholder="Phone" onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="company" value={form.company} placeholder="Company" onChange={handleChange} className="w-full p-2 border rounded" />
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Save</button>
            </form>
        </div>
    )
}   
export default EditCustomer