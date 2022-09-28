const mongoose = require("mongoose");

const myschema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
})

const Category = new mongoose.model("category",myschema);
module.exports = Category;