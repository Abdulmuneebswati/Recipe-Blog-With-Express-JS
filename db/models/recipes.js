const mongoose = require("mongoose");

const myschema2 = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    ingredients:{
        type:Array,
        required:true,
    },
    category:{
        type:String,
        enum:["Thai" , "American","Chineese","Mexican","Indian"],
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    is_verified: {
        type: Number,
        default: 0
    },
});

myschema2.index({name:'text',description:'text'})
// WildCard Indexing
// myschema2.index({"$**" : 'text'});

const Recipe = new mongoose.model("recipe",myschema2);
module.exports = Recipe;