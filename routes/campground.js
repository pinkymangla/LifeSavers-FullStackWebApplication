
const express=require('express')
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const {isLoggedIn, isAuthor,validateReq}=require('../middleware')
const campgrounds=require('../controllers/orgs')
const multer  = require('multer')
const {storage}=require('../cloudinary/index')
const upload = multer({storage})

router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn,upload.array("image"),validateReq,wrapAsync(campgrounds.create))
  

router.get("/new",isLoggedIn,campgrounds.newForm)

router.route("/:id")
    .get(wrapAsync(campgrounds.showDetails))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateReq,wrapAsync(campgrounds.edit))
    .delete(isAuthor,wrapAsync(campgrounds.deleteCamp))

router.get("/:id/edit",isLoggedIn,isAuthor,wrapAsync(campgrounds.editForm))


module.exports=router