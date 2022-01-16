const mongoose = require('mongoose');
const {isEmail} = require('validator');

const User = new mongoose.Schema({
    username:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true
    },
    imageURL:
    {
        type:String,
        required:true 
    }
});

module.exports=mongoose.model('User',User);