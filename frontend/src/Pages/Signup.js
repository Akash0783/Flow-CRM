import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
const Signup = ()=>{
    
    const [username, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSignup = async(e) =>{
        e.preventDefault()
        try{
            await axios.post("http://localhost:5000/api/auth/signup", {
                username,
                email,
                password,
            })
            alert("Signup Successful Please Login")
            navigate("/login")
        } catch(err){
            console.log("error occured: ",  err.response?.data || err.message)
            alert("Incorrect Credentials")
        }
    }


    return(
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSignup} className="bg-white p-6 rounded-lg shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4">Signup</h2>
                <input type="text" placeholder="Fullname" value={username} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Signup</button>
            </form>
        </div>
    )
}
export default Signup