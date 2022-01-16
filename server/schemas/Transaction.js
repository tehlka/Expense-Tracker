const mongoose = require('mongoose');

const Transaction = new mongoose.Schema({
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
    date:
    {
        type:Date,
        required:true
    },
    category:
    {
        type:String,
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

module.exports=mongoose.model('Transaction',Transaction);