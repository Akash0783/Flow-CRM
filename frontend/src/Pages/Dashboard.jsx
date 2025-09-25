import { useEffect, useState } from "react"
import api from "../api"

const Dashboard = ()=>{
    const[stats, setStats] = useState(null)

    useEffect(()=>{
        const fetchStats = async ()=>{
            try{
                const token = localStorage.getItem("token")
                const res = await api.get("/api/dashboard/stats", {
                    headers : {Authorization : `Bearer ${token}`}
                })
                setStats(res.data)
            }catch(err){
                console.error(err.response?.data || err.message)
            }
        }
        fetchStats()
    }, [])

    if(!stats) return <p className="text-gray-500 p-6">Loading...</p>
    return(
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Welcome to the Flow CRM</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-xl shadow p-6 text-center">
                    <h3 className="text-white mb-2">Customers</h3>
                    <p className="text-3xl font-bold text-white">{stats.totalCustomers}</p>
                </div>
                <div className="bg-gray-800 rounded-xl shadow p-6 text-center">
                    <h3 className="text-white mb-2">Leads</h3>
                    <p className="text-3xl font-bold text-white">{stats.totalLeads}</p>
                </div>
                <div className="bg-gray-800 rounded-xl shadow p-6 text-center">
                    <h3 className="text-white mb-2">Invoices</h3>
                    <p className="text-3xl font-bold text-white">{stats.totalInvoices}</p>
                </div>
                <div className="bg-gray-800 rounded-xl shadow p-6 text-center">
                    <h3 className="text-white mb-2">Pending Invoices</h3>
                    <p className="text-3xl font-bold text-white">{stats.pendingInvoices}</p>
                </div>
            </div>
        </div>
    )
}
export default Dashboard