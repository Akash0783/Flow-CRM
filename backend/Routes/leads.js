const express = require("express")
const router = express.Router()
const Lead = require("../Models/Leads")
const {authMiddleware} = require("../Middleware/Auth")

//Get All Leads
router.get("/", authMiddleware, async(req, res)=>{
    const leads = await Lead.find().sort({createdAt: -1})
    res.json({items: leads})
})

//Get a Single Lead
router.get("/:id", authMiddleware, async(req, res )=>{
    const lead = await Lead.findById(req.params.id)
    if(!lead) return res.status(404).json({error: "Lead not found"})
    res.json(lead)
})

//Create a New Lead
router.post("/", authMiddleware, async(req, res)=>{
    try{
        const newLead = new Lead(req.body)
        await newLead.save()
        res.status(201).json(newLead)
    }catch(err){
        console.error(err)
        res.status(400).json({error: err.message})
    }
})

//Update Lead
router.put("/:id", authMiddleware, async(req, res)=>{
    try{
        const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!updated) return res.status(404).json({error: "Lead not found"})
        res.json(updated)
    }catch(err){
        res.status(400).json({error: err.message})
    }
})

//Delete Lead
router.delete("/:id", authMiddleware, async(req, res)=>{
    await Lead.findByIdAndDelete(req.params.id)
    res.json({message: "The Lead has been successfully deleted"})
})

module.exports = router