const User=require('../models/user')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapBoxToken})

module.exports.registerForm=(req,res)=>{
    res.render("users/register")
}
module.exports.register=async (req,res,next)=>{
    try{

    
    const geoData= await geocoder.forwardGeocode({
        query:`${req.body.city+' '+req.body.state}`,
        limit:1
    }).send()
 
    geometry=(geoData.body.features[0].geometry)
    const {username,email,password,bloodGroup,donor}=req.body;
    const user=new User({username,email,geometry,bloodGroup,donor});
    const newuser=await User.register(user,password);
    req.login(newuser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash('success',`Welcome ${req.user.username}! You are now registered.`)
        res.redirect('/campgrounds')
    })
    }catch(e){
        req.flash('error',e.message);
        return res.redirect('/register')
    }
}

module.exports.loginForm=(req,res)=>{
    res.render('users/login')
}
module.exports.login=(req,res)=>{
    req.flash('success',`Welcome Back! ${req.user.username}`);
    if(req.session.returnTo){
        const p=req.session.returnTo
        delete req.session.returnTo;
        return res.redirect(p)
    }
    res.redirect('/campgrounds')
}

module.exports.logout=(req,res)=>{
    try{
    req.logout((err)=>{
        if(err){
            throw err;
        }else{
            req.flash('success','Logged you out successfully');
            res.redirect("/campgrounds")
        }
    })
    }catch(e){
        req.flash("error","Error in Logging out please try again!")
        res.redirect("/campgrounds")
    }
    
}