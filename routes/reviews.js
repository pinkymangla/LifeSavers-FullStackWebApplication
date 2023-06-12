const express=require('express')
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const {validateReview, isLoggedIn,isReviewAuthor}=require('../middleware')
const reviews=require('../controllers/reviews')

//CREATE
router.post("/",isLoggedIn,validateReview,wrapAsync(reviews.create))

//DELETE
router.delete("/:rid",isLoggedIn,isReviewAuthor,wrapAsync(reviews.delete))

module.exports=router