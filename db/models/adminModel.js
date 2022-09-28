const mongoose = require("mongoose");

const myschema3 = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
});

const Admin = new mongoose.model("admin",myschema3);
module.exports = Admin;