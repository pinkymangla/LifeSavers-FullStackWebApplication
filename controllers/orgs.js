const Org=require('../models/orgs.js')
const User=require('../models/user.js')
const {cloudinary}=require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapBoxToken})


module.exports.index=async (req,res)=>{
    const camps=await Org.find({});
    const users=await User.find({donor:true});
    const activeUser=req.user?req.user:{}
    console.log(activeUser)
    res.render('campgrounds/index',{camps,users,activeUser});
}

module.exports.newForm=(req,res)=>{
    res.render("campgrounds/new");
}

module.exports.create=async (req,res,next)=>{
    const {stockAvail}=req.body
    const geoData= await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const c=new Org(req.body.campground);
    c.stockAvail=[]
    for(let s in stockAvail){
        const obj={}
        obj.btype=s
        obj.qty=stockAvail[s]
        c.stockAvail.push(obj)
    }
    c.author=req.user._id
    c.geometry=(geoData.body.features[0].geometry)
    c.images=req.files.map(f=>({url:f.path,filename:f.filename}))
    const data=await c.save();
    console.log(data)
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${data._id}`)

}

module.exports.showDetails=async (req,res)=>{
    const {id}=req.params;
    const camp=await Org.findById(id)
    .populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    })
    .populate('author');
    //  console.log(camp)
    if(!camp){
        req.flash('error','Cannot find that campground :(')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/details',{camp});
}

module.exports.edit=async (req,res)=>{
    const {stockAvail}=req.body
    const {id}=req.params;
    console.log("HEEEEEEEYYYY")
    console.log(req.body)
    stockAvail2=[]
    for(let s in stockAvail){
        const obj={}
        obj.btype=s
        obj.qty=stockAvail[s]
        stockAvail2.push(obj)
    }
    const camp=await Org.findByIdAndUpdate(id,{...req.body.campground,stockAvail:stockAvail2});
    const img=req.files.map(f=>({url:f.path,filename:f.filename}))
    camp.images.push(...img)
    await camp.save()
    if(req.body.deleteImages){
        for(let f of req.body.deleteImages){
           await cloudinary.uploader.destroy(f)
        }
        await camp.updateOne({$pull: {images:{filename: {$in: req.body.deleteImages}}}})
    }

    req.flash('success','Updated Sucessfully!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.editForm=async (req,res)=>{
    const {id}=req.params;
    const camp=await Org.findById(id);
    if(!camp){
        req.flash('error','Cannot find that campground :(')
        res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit",{camp})
}

module.exports.deleteCamp=async (req,res)=>{
    const {id}=req.params;
    await Org.findByIdAndDelete(id);
    req.flash('success','Deleted Organisation successfully!')
    res.redirect('/campgrounds')
}