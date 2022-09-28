const express = require("express");
const {isLogin,isLogout} = require("../auth/auth");
const adminRoute = express.Router();
const Admincontroller = require("../controllers/adminController");

adminRoute.get("/login",Admincontroller.getLoginPage);
adminRoute.post("/login",Admincontroller.postLoginPage);
adminRoute.get("/approverecipe",Admincontroller.appproveRecipes);
adminRoute.get("/approverecipe/:id",Admincontroller.viewApprovalRecipe)
adminRoute.get("/approverecipe/update/:id",Admincontroller.approveRecipe);
module.exports = adminRoute;