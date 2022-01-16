const mongoose = require('mongoose');

const Reminder = new mongoose.Schema({
    user_id:
    {
        type:String,
        required:true
    },
    amount:
    {
        type:Number,
        required:true,
        min:1
    },
    due_date:
    {
        type:Date,
        required:true
    },
    relation:
    {
        type:String,
        required:true
    },
    person:
    {
        type:String,
        required:true
    }
});

module.exports=mongoose.model('Reminder',Reminder);