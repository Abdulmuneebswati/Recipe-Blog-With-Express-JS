require("dotenv").config();
const Admin = require("../db/models/adminModel");
const bcrypt = require("bcryptjs");
const Recipe = require("../db/models/recipes");
const transporter = require("../configEmail/transporter");
class Admincontroller {
//getLoginPage   
    static getLoginPage = (req,res)=>{
        const infoErrorsObj = req.flash('infoError');
        res.render("login",{
            title:"Cooking Blog - Login",
            infoErrorsObj
        });
    }
//postLoginPage
    static postLoginPage = async (req,res)=>{
        try {
            const {email,password} = req.body;
            if (email && password) {
                const findAdmin = await Admin.findOne({email});
                if (findAdmin) {
                    const isMatch = await bcrypt.compare(password,findAdmin.password);
                    if (isMatch) {
                        req.session._id = findAdmin._id.toString();
                        res.redirect("/admin/approverecipe");
                    }else{
                        req.flash("infoError","Invalid Login");
                        res.redirect("/admin/login");
                    }
                }else{
                    req.flash("infoError","Invalid Login");
                    res.redirect("/admin/login");
                }
            }else{
                req.flash("infoError","Invalid Login");
                res.redirect("/admin/login");
            }
        } catch (error) {
            req.flash("infoError","Invalid Login");
            res.redirect("/admin/login");
        }
}
// appproveRecipes
    static appproveRecipes = async(req,res)=>{
        try {
            const findRecipeForApproval = await Recipe.find({is_verified:0});
        res.render("approveRecipe",{
            title:"Cooking Blog - Approve Recipe",
            recipe:findRecipeForApproval
        });
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
//viewApprovalRecipe
    static viewApprovalRecipe = async(req,res)=>{
        const _id = req.params.id;
        const recipe = await Recipe.findById(_id);
        res.render("seeRecipeForApproval",{
            title:"Cooking Blog - Approve Recipe",
            recipe:recipe,
        });
    }
    static approveRecipe = async(req,res)=>{
        try {
            const _id = req.params.id;
        const recipe = await Recipe.findByIdAndUpdate(_id,{$set:{is_verified:1}},{new:true});
        const link = `http://localhost:4000/recipe/${recipe._id}`
        let info = await transporter.sendMail({
            from: process.env.Email_FROM,
            to: recipe.email, 
            subject: "Recipe approval update",  
            html: `<b>Hello Dear Applicant <br></b> <h3>Your recipe has been approved by admin.<br> we are very
             thankful to you for sharing your idea with us.The link to see your recipe on our site is attached below.
              Kindly visit</h3> <h2>Link</h2> <br> <h4>${link}</h4>`,
          });
        
        res.redirect("/admin/approverecipe");
        } catch (error) {
            req.send("error");
            console.log(error);
        }
    }
//
}
module.exports = Admincontroller;


