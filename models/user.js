const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose')
const opts = { toJSON: { virtuals: true } };
const schm=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name: {
        type: String,
        
    },
    contact: {
        type: Number,
    },
    donor: {
        type: Boolean,
       
    },
    bloodGroup: {
        type: String,
        enum: ['O+ve', 'O-ve', 'A+ve', 'A-ve', 'B+ve', 'B-ve', 'AB+ve', 'AB-ve'],
       
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          
        },
        coordinates: {
          type: [Number],
          
        }
      }


},opts)

schm.virtual('properties.popupMarkup').get(function(){
    return `
    <strong>${this.username}</a></strong>
    <p>${this.bloodGroup}
    `
})

schm.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',schm);