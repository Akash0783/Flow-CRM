import { Routes, Route, Navigate} from "react-router-dom";
import Customer from "./Pages/Customer";
import Invoices from "./Pages/Invoices";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AddCust from "./Pages/AddCustomer";
import { useContext } from "react";
import { AuthContext} from "./Context/AuthContext";
import EditCustomer from "./Pages/EditCustomer";
import AddInvoices from "./Pages/AddInvoices";
import Leads from "./Pages/Leads";
import AddLeads from "./Pages/AddLeads";
import EditLeads from "./Pages/EditLeads";
import EditInvoice from "./Pages/EditInvoice";
import ProtectedRoute from "./Components/ProtectedRoute"
import UserDashboard from "./Pages/UserDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminUsers from "./Pages/AdminUsers";
import AdminReports from "./Pages/AdminReports";
import {Toaster} from "react-hot-toast"

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
     <>
         <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
         <Routes>
            {/* Login & Signup */} 
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}> <AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />

            {/* Dashboard */}
            <Route path="/user" element={<ProtectedRoute allowedRoles={['user','admin']}><UserDashboard /></ProtectedRoute>} />
            
            {/* Customers */}
            <Route path="/customers" element={<ProtectedRoute allowedRoles={['user','admin']}> <Customer /> </ProtectedRoute>} />
            <Route path="/customers/add" element = {<ProtectedRoute allowedRoles = {['user', 'admin']}><AddCust /></ProtectedRoute>} />
            <Route path="customers/edit/:id" element = {<ProtectedRoute allowedRoles={['user','admin']}><EditCustomer /></ProtectedRoute>} />
            
            {/* Invoices */}
             <Route path="invoices" element = {<ProtectedRoute allowedRoles={['user','admin']}><Invoices /></ProtectedRoute>} />
             <Route path="/invoices/add" element = {<ProtectedRoute allowedRoles={['user','admin']}><AddInvoices /></ProtectedRoute>}/>
             <Route path="/invoices/edit/:id" element = {<ProtectedRoute allowedRoles={['user','admin']}><EditInvoice /></ProtectedRoute>} />
            
            {/* Leads */}
             <Route path="/Leads" element = {<ProtectedRoute allowedRoles={['user','admin']}><Leads /></ProtectedRoute>} />
             <Route path="/leads/add" element = {<ProtectedRoute allowedRoles={['user','admin']}><AddLeads /></ProtectedRoute>} />
             <Route path="/leads/edit/:id" element = {<ProtectedRoute allowedRoles={['user','admin']}><EditLeads /></ProtectedRoute>} />
            
            {/* Default Redirect */}
             <Route path="*" element={<Login />} />
       </Routes>
    </>   
  );
}

export default App;