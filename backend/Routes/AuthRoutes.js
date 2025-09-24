const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../Models/User")
const {authMiddleware, roleMiddleware} = require("../Middleware/Auth")

const JWT_SECRET = "Akash123"

router.post("/signup", async(req, res)=>{
    try{
        console.log("Incoming Request Body",req.body)
        const {username, email, password} = req.body

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({error: "Email Already in Use"})
        }

          if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        })
        await newUser.save()

        res.status(201).json({message: "User registered Successfully"})
    }catch(err){
        console.log("Register error", err.message)
        res.status(400).json({error: "Server error"})
    }
})

router.post("/login", async(req, res)=>{
    try{
        const{email, password} = req.body

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({error: "Invalid email or Password"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({error: "Invalid email or Password"})
        }
        
        const payload = { id: user._id, email:user.email, role: user.role } ;
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });


        res.json({message: "Login Successful", token, user: {id: user._id, username : user.username, email : user.email, role : user.role}})
    }catch(err){
        res.status(500).json({error: "Server error"})
    }
})

router.get("/profile", async(req, res) => {
    try{
        const user  = await User.findById(req.user.id).select("-password")
        if(!user){
            return res.status(404).json({error: "User not found"})
        }
        res.json(user)
    }catch(err){
        console.error("Error fetching user: ", err.message)
        res.status(500).json({error : "Server error"})
    }
})

router.put("/admin/users/:id/role", authMiddleware, roleMiddleware("admin"), async(req, res) => {
    try{
        const {id} = req.params
        const {role} = req.body

        //Validate the role
        if(!["admin", "user"].includes(role)){
            return res.status(400).json({error: "Invalid role. Allowed only: admin, user"})
        }
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.role = role
        await user.save()

        res.json({message: `User Role Updated to ${role}`, user:{id: user._id, username: user.username, email: user.email, role: user.role}})
    }catch(err){
        console.error("Error Updating user role", err)
        res.status(500).json({error: "Server Error"})
    }
})


module.exports = router
