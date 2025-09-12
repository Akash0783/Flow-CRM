import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const navigate = useNavigate()
    const[user,setUser] = useState(null);
        useEffect(() => {
            const token = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");
            if (token && savedUser) {
                setUser(JSON.parse(savedUser));
            } else {
            navigate("/login");
            }
            }, []);

    const logout = ()=>{
        localStorage.removeItem("token");
        setUser(null)
        navigate("/login")
    }
    return(
        <div>
            <AuthContext.Provider value = {{user, setUser,logout}}>{children}</AuthContext.Provider>
        </div>
    )
}
