if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express=require('express')
const mongoose=require('mongoose')
const path=require('path')
const ejsMate=require('ejs-mate')
const Joi=require('joi')
const methodOverride=require('method-override')
const Campground=require('./models/orgs.js')
const ExpressError=require('./utils/ExpressError');
const {campgroundSchema,reviewSchema}=require('./schema.js');
const Review = require('./models/reviews.js')
const campgroundRoutes=require('./routes/campground')
const reviewRoutes=require('./routes/reviews')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require('./models/user')
const userRoutes=require('./routes/user')
const {isLoggedIn}=require('./middleware')

const mongoSanitize = require('express-mongo-sanitize');



mongoose.set('strictQuery', false)
// mongodb+srv://LifeSaverUser:LifeSaver123@users.n9upple.mongodb.net/LIFE_SAVER?retryWrites=true&w=majority
// mongoose.connect('mongodb://127.0.0.1:27017/team2')
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Mongo Connceted------------------------");
    }).catch(()=>{
        console.log("Mongo Error-----------------------------");
    })
;

const app=express();
app.set("view engine","ejs")
app.set("views",path.join(__dirname,'/views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,'public')))
const sessionConfig={
    secret:'password',
    resave:false,
    saveUninitialized:true, 
    cookie:{
        expires:Date.now()+(1000*60*60*24*7),
        maxAge:(1000*60*60*24*7),
        httpOnly:true
    }
   
}
app.use(session(sessionConfig))
app.use(flash())
app.use(mongoSanitize({
    replaceWith: '_',
  }))

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // console.log(req.session)
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error')
    res.locals.currentUser=req.user
    next();
})


app.get('/testing',(req,res)=>{
    res.render('eligibility')
})

app.get('/',(req,res)=>{
    res.render('abc')
    //res.send("hello from yelpcamp")
})





// app.get('/fakeuser',async (req,res)=>{
//     const user=new User({username:'ayesha',email:'ayesha@gmail.com'})
//     const newuser=await User.register(user,'homework');
//     res.send(newuser)
// })



app.use('/',userRoutes)

app.use('/campgrounds',campgroundRoutes)



app.use('/campgrounds/:id/reviews',reviewRoutes)




app.all('*',(req,res,next)=>{
    next(new ExpressError("Page Not Found",404))
})


app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message){
        err.message="Oh no! Something went wrong!"
    }
    res.status(statusCode).render('error',{err});
})


app.listen(3000,()=>{
    console.log("Listening on port 3000");
})