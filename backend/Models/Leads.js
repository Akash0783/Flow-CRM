const mongoose = require("mongoose")

const leadSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String},
    phone: {type: String},
    source: {type: String},
    status: {type: String, enum: ["New", "Contacted", "Qualified", "Converted", "Lost"], default: "New"},
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Lead", leadSchema)