import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../Context/AuthContext"

const Login = ()=>{
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const{setUser} = useContext(AuthContext)

    const handleLogin = async(e)=>{
        e.preventDefault()
        try{
            const res = await axios.post("http://localhost:5000/api/auth/login",{
                email,
                password,
            })
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", JSON.stringify(res.data.user))
            setUser(res.data.user)
            navigate("/")
        }catch(err){
            console.log("Login Failed: ", err.response?.data || err.message)
            alert("Login Failed")
        }
    }
    return(
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form className="bg-white p-1 rounded-lg shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="Paswword" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
                 <p className="text-sm mt-4 text-center">Don’t have an account?{" "}<span className="text-blue-600 cursor-pointer" onClick={() => navigate("/signup")}> Sign Up</span></p>
            </form>
        </div>
    )
}
export default Login