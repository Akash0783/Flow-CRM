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
import AddInvoices from "./Pages/AddInvoices";
import Leads from "./Pages/Leads";
import AddLeads from "./Pages/AddLeads";
import EditLeads from "./Pages/EditLeads";
import EditInvoice from "./Pages/EditInvoice";
import Profile from "./Pages/Profile";

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
             <Route path="/customers/add" element = {user? <AddCust />: <Navigate to={"/login"}/>} />
             <Route path="customers/edit/:id" element = {<EditCustomer />} />
             <Route path="Invoices" element = {<Invoices />} />
             <Route path="/invoices/add" element = {<AddInvoices />}/>
             <Route path="invoices/edit/:id" element = {<EditInvoice />} />
             <Route path="/Leads" element = {<Leads />} />
             <Route path="/leads/add" element = {<AddLeads />} />
             <Route path="/leads/edit/:id" element = {<EditLeads />} />
              <Route path="/profile" element={<Profile />} />
       </Routes>

              </main>
           </div>
       </div>

      

  );
}

export default App;