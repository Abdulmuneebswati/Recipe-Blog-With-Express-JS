const express = require("express");
require("dotenv").config();
const hbs = require("hbs");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const adminRoute = require("./routes/adminroute");
const flash = require("connect-flash");
require("./db/conn");
const port = process.env.PORT;
const userRoute = require("./routes/userRoutes");
const app = express();


const staticPath = path.join(__dirname,"/public");
const dynamicPath = path.join(__dirname,"./templates/views");
const partialPath = path.join(__dirname,"./templates/partials");

// middlewares
app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret:process.env.SECRET,
    saveUninitialized:false,
    resave:false,
}));
app.use(flash());
app.use(fileUpload());

app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set("view engine","hbs");
app.set("views",dynamicPath);
hbs.registerPartials(partialPath);


app.use(userRoute);
app.use("/admin",adminRoute);
app.listen(port,()=>{
    console.log("Done");
})