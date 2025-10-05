const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables
require("dotenv").config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: "https://68e1e0bd7a1a6429f789520e--aktrack.netlify.app", 
    credentials: true,
}));

app.use(express.json()); // parse JSON bodies

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(async() => {
    console.log("MongoDB Connected")
    
    const user = require("./Models/User")
    const bcrypt = require("bcryptjs")

    const adminExists = await user.findOne({role : "admin"})

    if(!adminExists){
      const hashedPassword = await bcrypt.hash("Admin@123", 10)
      const adminUser = new user({
        username : "admin",
        email: "admin123@gmail.com",
        password: hashedPassword,
        role: "admin"
    })
    await adminUser.save()
     console.log("✅ Default admin created: email=admin123@gmail.com, password=Admin@123");
  }else{
    console.log("ℹ️ Admin already exists");
  }
 })
  .catch((err) => console.error("MongoDB connection failed:", err));


// Import routes
const cusRoutes = require("./Routes/cusRoutes");
const invoiceRoutes = require("./Routes/invoices");
const AuthRoutes = require("./Routes/AuthRoutes")
const authMiddleware = require("./Middleware/Auth")
const leads = require("./Routes/leads")
const Dashboard = require("./Routes/Dashboard")
const Profile = require("./Routes/Profile")
const Users = require("./Routes/userRoutes")

// Use routes
app.use("/api/auth", AuthRoutes)
app.use("/api/customers",  cusRoutes);
app.use("/api/invoices",  invoiceRoutes);
app.use("/api/leads", leads)
app.use("/api/dashboard", Dashboard)
app.use("/api/profile", Profile)
app.use("/api/users", Users)

// Test route
app.get("/", (req, res) => {
  res.send("CRM Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));