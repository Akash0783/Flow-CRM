const express = require("express")
const router = express.Router()
const Invoice = require("../Models/Invoice")
const {authMiddleware} = require("../Middleware/Auth")
router.get("/", authMiddleware, async(req, res)=>{
    try{
        const invoices = await Invoice.find().populate("customer")
        res.json(invoices)
    }catch(err){
        res.status(500).json({error: "Server error"})
    }
})

router.post("/", authMiddleware, async(req, res) => {
    try{
        const invoice = new Invoice(req.body)
        await invoice.save()
        res.status(201).json(invoice)
    }catch(err){
        res.status(400).json({error: err.message})
    }
})

// GET invoice by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("customer");
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE invoice by ID
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedInvoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async(req, res)=>{
    try{
      await Invoice.findByIdAndDelete(req.params.id)
      res.json({message: "Invoice Deleted."})
    }catch(err){
        res.status(400).json({error: err.message})
    }
})

module.exports = router
