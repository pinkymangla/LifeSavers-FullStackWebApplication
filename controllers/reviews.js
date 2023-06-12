const Campground=require('../models/orgs.js')
const Review = require('../models/reviews.js')


module.exports.create=async (req,res)=>{
    const {id}=req.params;
    const rev=req.body
    const camp=await Campground.findById(id)
    const review= new Review(req.body)
    review.author=req.user._id
    // console.log(review)
    camp.reviews.push(review)
    // console.log(camp)
    await review.save()
    await camp.save()
    req.flash('success','Success! Created a new review')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.delete=async (req,res)=>{
    // res.send("Deleting")
    const {id,rid}=req.params
    await Campground.findByIdAndUpdate(id,{$pull: {reviews: rid}})
    await Review.findByIdAndDelete(rid)
    req.flash('success','Deleted your review')

    res.redirect(`/campgrounds/${id}`)
}