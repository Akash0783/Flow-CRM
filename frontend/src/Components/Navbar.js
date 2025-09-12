import { useContext } from "react"
import { AuthContext } from "../Context/AuthContext"
import { Navigate } from "react-router-dom"

const Navbar = ({title})=>{

    const {user, logout} = useContext(AuthContext)
    console.log(user)

    return(
        <div className='h-16 bg-white shadow flex items-center justifiy between px-6'>
            <h1  className="text-lg font-semibold">{title}</h1>
            {user? <button onClick={logout} className="bg-red-500 text-white py-2 px-4 rounded">Logout</button> : <Navigate to={"/login"}/>}
        </div>
    )
}
export default Navbar