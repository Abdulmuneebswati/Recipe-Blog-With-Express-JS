const express = require("express");
const Usercontroller = require("../controllers/userController");
const userRoute = express.Router();


userRoute.get("/",Usercontroller.getHomePage);
userRoute.get("/recipe/:id",Usercontroller.getRecipePage);
userRoute.get("/categories",Usercontroller.getCategoriesPage);
userRoute.get("/categories/:id",Usercontroller.getEachCategory);

userRoute.post("/search",Usercontroller.searchRecipe);
userRoute.get("/explore-latest",Usercontroller.exploreLatestRecipe);
userRoute.get('/random-recipe',Usercontroller.exploreRandomRecipes);
userRoute.get("/submit-recipe",Usercontroller.getSubmitPage);
userRoute.post("/submit-recipe",Usercontroller.submitRecipe);
userRoute.get("/recipe/generatepdf/:id",Usercontroller.generateRecipePdf);

module.exports = userRoute;