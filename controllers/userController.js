const Category = require("../db/models/categories");
const Recipe = require("../db/models/recipes");
const hbs = require("hbs");
const path = require("path");
const pdf = require("html-pdf");
const fs = require("fs");
const { format } = require("path");
class Usercontroller{

//getHomePage
    static getHomePage = async (req,res)=>{
        try {
            const limitOfCategory = 5;
        const insertInCategory = await Category.find().limit(limitOfCategory);
        const latestRecipe = await Recipe.find({is_verified:1}).sort({_id:-1}).limit(limitOfCategory);
        const Thai = await Recipe.find({$and:[{category:"Thai"},{is_verified:1}]}).limit(limitOfCategory);
        const Chinese = await Recipe.find({$and:[{category:"Chinese"},{is_verified:1}]}).limit(limitOfCategory);
        const Mexican = await Recipe.find({$and:[{category:"Mexican"},{is_verified:1}]}).limit(limitOfCategory);
        const American = await Recipe.find({$and:[{category:"American"},{is_verified:1}]}).limit(limitOfCategory);
        const Indian = await Recipe.find({$and:[{category:"Indian"},{is_verified:1}]}).limit(limitOfCategory);

        const food = {latestRecipe,Indian,Mexican,American,Chinese,Thai}
        res.render("index",{
            title:"Cooking Blog - Home",
            category:insertInCategory,
            food:food,
        });
        } catch (error) {
           console.log(error);
           res.send(error).status(500); 
        }
    }
//getCategoriesPage
    static getCategoriesPage = async (req,res)=>{
        try {
            const categories = await Category.find();
        res.render("categories",{
            title:"Cooking Blog - Categories",
            category:categories,
        })
        } catch (error) {
            console.log(error);
           res.send(error).status(500); 
        }
    }
//getRecipePage
    static getRecipePage = async(req,res)=>{
        try {
            const recipeId = req.params.id;
            const findRecipe = await Recipe.findOne({$and: [{_id:recipeId},{is_verified:1}]});
            res.render("recipe",{
                title: "Cooking Blog - Recipe",
                recipe:findRecipe
            })
        } catch (error) {
            console.log(error);
           res.send(error).status(500); 
        }
    }

//getEachCategory
    static getEachCategory = async(req,res)=>{
        try {
            let categoryId = req.params.id;
            const limitNumber = 30;
            const categoryById = await Recipe.find({$and:[{category:categoryId},{is_verified:1}]}).limit(limitNumber);
            res.render("categories",{
                title:"Cooking Blog - Categories",
                categoryid:categoryById,
            });
        } catch (error) {
            console.log(error);
            res.send(error).status(500);
        }
    }

//searchRecipe
    static searchRecipe = async(req,res)=>{
        try {
            let searchTerm = req.body.searchTerm;
            let recipe = await Recipe.find({$and :[{ $text: {$search : searchTerm, $diacriticSensitive:true}},{is_verified:1}]});
            res.render("search",{
                title:"Cooking Blog - Search",
                recipe:recipe
            })
        } catch (error) {
            console.log(error);
            res.send(error).status(500);
        }

    }

//exploreLatestRecipe
    static exploreLatestRecipe = async(req,res)=>{
        try {
            const limitNumber = 20;
            const recipe = await Recipe.find({is_verified:1}).sort({_id:-1}).limit(limitNumber);
            res.render("explorelatest",{
                title:"Cooking Blog - Latest",
                recipe:recipe
            })
        } catch (error) {
            console.log(error);
            res.send(error).status(500);
        }
    }
    // exploreRandomRecipes
    static exploreRandomRecipes = async (req,res)=>{
        try {
            let count = await Recipe.find({is_verified:1}).countDocuments();
            let random = Math.floor(Math.random()*count);
            let recipe = await Recipe.findOne({is_verified:1}).skip(random);
            res.render("exploreRandom",{
                title:"Cooking Blog - Random Recipe",
                recipe:recipe
            })
        } catch (error) {
            console.log(error);
            res.send(error).status(500);
        }
    }
//getSubmitPage
    static getSubmitPage = (req,res)=>{
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render("submitRecipe",{
            title:"Cooking Blog - Submits Recipe",
            infoErrorsObj,infoSubmitObj
        })
    }
//submitRecipe
    static submitRecipe = async(req,res)=>{
        try {
            let imageUploadFile;
            let uploadPath;
            let newImageName;
            if (req.files || object.keys(req.files).length != 0) {
                imageUploadFile = req.files.image;
                
                newImageName = Date.now() +imageUploadFile.name;

                uploadPath = require("path").resolve("./") + "/public/uploads/" + newImageName;
                imageUploadFile.mv(uploadPath,function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
                
            } else {
                console.log("no files were uploaded");
                
            }
             const newRecipe = new Recipe({
                name:req.body.name,
                description:req.body.description,
                email:req.body.email,
                ingredients:req.body.ingredients,
                category:req.body.category,
                image:newImageName
            });
            await newRecipe.save();
            req.flash("infoSubmit","Your recipe has been sent to the admin. You will get the approval email once your recipe will be approved by admin.");
            res.redirect("/submit-recipe");
        } catch (error) {
            req.flash("infoErrors","All fields are required");
            res.redirect("/submit-recipe");              
        }
    }
    //generateRecipePdf
    static generateRecipePdf = async (req,res)=>{
        try {
            const _id = req.params.id;
        const findRecipe = await Recipe.findOne({_id:_id}).lean();
        const data = {recipe:findRecipe};
        const filePath = path.resolve(__dirname,"../templates/htmltopdf.hbs");
        const readhbsFile = fs.readFileSync(filePath).toString();
        let options = {format:"letter"};
        const renderHbsFile = hbs.compile(readhbsFile);
        const addRecipeDataInHbsFile =  renderHbsFile(data);
        pdf.create(addRecipeDataInHbsFile,options).toFile(`${findRecipe.name}.pdf`,(error,response)=>{
            if (error) console.log(error);
            const savedIn = path.resolve(__dirname,`../${findRecipe.name}.pdf`)
            fs.readFile(savedIn,(err,file)=>{
            if (error){
                 console.log(error)
                 res.send(err);
            }
            res.setHeader("Content-Type","application/pdf");
                    res.setHeader("Content-Disposition",`attachment;filename=${findRecipe.name}.pdf`);
                    res.send(file);
            })
        })
        } catch (error) {
          console.log(error);
          res.send(error);  
        }
    }
}
module.exports = Usercontroller;


