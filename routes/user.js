const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync')
const passport=require('passport');
const users=require('../controllers/users')


//REGISTER
router.route("/register")
    .get(users.registerForm)
    .post(wrapAsync(users.register))


//LOGIN
router.route("/login")
    .get(users.loginForm)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),users.login)



//LOGOUT
router.get("/logout",users.logout)


module.exports=router