const mongoose=require('mongoose');
const Review = require('./reviews');
const Schema=mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
const imageSchema=new Schema({
    url:String,
    filename:String
});
imageSchema.virtual('thumbnail').get(function(){
   return this.url.replace("/upload","/upload/w_200");
});
const stockschm=new mongoose.Schema({
    btype:{
        type:String,
        required:true,
        enum:['O+ve','O-ve','A+ve','A-ve','B+ve','B-ve','AB+ve','AB-ve']
    },
    qty:Number
}) 
const orgSchm=new Schema({
    title:String,
    price:{
        type:Number,
        min:0
    },
    images:[imageSchema],
    description:String,
    location:String,
    reviews:[{type:mongoose.Schema.Types.ObjectId,ref:'Review'}],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      otype:{
        type:String,
        enum:['Hospitals','Non-Profit','Blood Bank']
    },
    website:String,
    stockAvail:[stockschm]



},opts);
orgSchm.virtual('properties.popupMarkup').get(function(){
    return `
    <strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>
    <p>${this.description.substr(0,30)}...
    `
})


orgSchm.post('findOneAndDelete',async (camp)=>{
    if(camp.reviews.length){
        const rep=await Review.deleteMany({_id:{$in : camp.reviews}})
        console.log(rep)
    }
})


module.exports=mongoose.model('Organisations',orgSchm);
