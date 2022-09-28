const isLogin = (req,res,next)=>{
    if (req.session._id) {
        next();
    }
    else{
        res.redirect("/admin/login");
    }
}


const isLogout = (req,res,next)=>{
    if (req.session._id) {
        res.redirect("/admin/approverecipe");
    }else{
        next();
    }
    
}


module.exports = {isLogin,isLogout};