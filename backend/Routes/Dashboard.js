const express = require("express")
const router = express.Router()
const Customer = require("../Models/Customer")
const Invoice = require("../Models/Invoice")
const Leads = require("../Models/Leads")
const {authMiddleware} = require("../Middleware/Auth")

router.get("/stats", authMiddleware,  async(req, res)=>{
    try{
        const totalCustomers = await Customer.countDocuments()
        const totalInvoices = await Invoice.countDocuments()
        const totalLeads = await Leads.countDocuments()
        const pendingInvoices = await Invoice.countDocuments({status : "Pending"})

        res.json({totalCustomers,totalInvoices,totalLeads,pendingInvoices})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router