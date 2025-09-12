import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";
import Customer from "./Pages/Customer";
import Invoices from "./Pages/Invoices";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AddCust from "./Pages/AddCustomer";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import EditCustomer from "./Pages/EditCustomer";


function App() {
   const {user} = useContext(AuthContext)
   if(!user){
    return(
      <Routes>
          <Route path="/login" element ={<Login />} />
          <Route path="/signup" element = {<Signup />} /> 
          <Route path ="*" element = {<Navigate to={"/login"}/>} />
      </Routes>
    )
   }
  return (
           <div className="flex h-screen bg-gray-100">
             <Sidebar />

             <div className="flex-1 flex flex-col">
             <Navbar />
            
             <main className="p-6 flex-1 overflow-y-auto"> 
             <Routes>
             <Route path="/" element={<Dashboard />} />
             <Route path="/customers" element={ <Customer />}/>
             <Route path="Invoices" element = {<Invoices />} />
             <Route path="/customers/add" element = {user? <AddCust />: <Navigate to={"/login"}/>} />
             <Route path="customers/edit" element = {<EditCustomer />} />
             <Route path="*" element={<Navigate to={"/"} />}/>
       </Routes>

              </main>
           </div>
       </div>

      

  );
}

export default App;