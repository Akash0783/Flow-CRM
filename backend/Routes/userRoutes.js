const express = require("express")
const router = express.Router()
const User = require("../Models/User")
const {authMiddleware, roleMiddleware} = require("../Middleware/Auth")

//Get all Users (For admin only)
router.get("/", authMiddleware,roleMiddleware("admin"), async (req, res) =>{
    try{
        const users = await User.find().select("-password")
        res.json(users)
    }catch(err){
        console.error("Fetch users error:", err);
        res.status(500).json({error: "Server Error"})
    }
})

// Delete user
router.delete("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update user role 
router.put("/:id/role", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role}`, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
