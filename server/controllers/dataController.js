const Transaction = require('../schemas/Transaction');
const Reminder = require('../schemas/Reminder');
const User = require('../schemas/User');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

module.exports.add_transaction = async (req,res) =>
{
    const {user_id,amount,date,category,relation,person} = req.query;
    try{
        const transaction_id = await Transaction.create({user_id,amount,date,category,relation,person});
        res.status(201).send("Success!!");
    }catch(err){
        res.status(400).send("Error");
    }
}

module.exports.get_transaction_categories = async (req,res) =>
{
    const {user_id} = req.query;
    const categories = await Transaction.find({user_id:user_id}).distinct("category");
    res.status(200).send(categories);
}

module.exports.get_transaction_vendors = async (req,res) =>
{
    const {user_id} = req.query;
    const vendors = await Transaction.find({user_id:user_id}).distinct("person");
    res.status(200).send(vendors);
}

module.exports.get_transaction = async (req,res) =>
{
    const {user_id,startDate,endDate,relation,category,vendor} = req.query;
    const transactions = await Transaction.find(
        {user_id:user_id,
        date:{$lte:endDate,$gte:startDate},
        relation:{$in:relation},
        category:{$in:category},
        person:{$in:vendor}});
    res.status(200).send(transactions);
}

module.exports.get_all_transactions = async (req,res) =>
{
    const {user_id} = req.query;
    const transactions = await Transaction.find({user_id:user_id});
    res.status(200).send(transactions);
}

module.exports.get_all_transactions_by_date = async (req,res) =>
{
    const {user_id,startDate,endDate} = req.query;
    const transactions = await Transaction.find(
        {user_id:user_id,
        date:{$lte:endDate,$gte:startDate}
        });
    res.status(200).send(transactions);
}

module.exports.delete_transaction = async (req,res) =>
{
    const {trans_id} = req.query;
    await Transaction.deleteOne({_id:trans_id}).then(()=>{
        res.status(200).send("Success!!");
    });
}

module.exports.add_reminder = async (req,res) =>
{
    const {user_id,amount,due_date,relation,person} = req.query;
    try{
        const reminder_id = await Reminder.create({user_id,amount,due_date,relation,person});
        res.status(201).send("Success!!");
    }catch(err){
        res.status(400).send("Error");
    }
}

module.exports.get_reminder_vendors = async (req,res) =>
{
    const {user_id} = req.query;
    const vendors = await Reminder.find({user_id:user_id}).distinct("person");
    res.status(200).send(vendors);
}

module.exports.get_reminder = async (req,res) =>
{
    const {user_id,start_date,end_date,relation,vendor} = req.query;
    const reminders = await Reminder.find(
        {user_id:user_id,
        due_date:{$lte:end_date,$gte:start_date},
        relation:{$in:relation},
        person:{$in:vendor}});
    res.status(200).send(reminders);
}

module.exports.get_all_reminders = async (req,res) =>
{
    const {user_id} = req.query;
    const reminders = await Reminder.find({user_id:user_id});
    res.status(200).send(reminders);
}

module.exports.delete_reminder = async (req,res) =>
{
    const {reminder_id} = req.query;
    await Reminder.deleteOne({_id:reminder_id}).then(()=>{
        res.status(200).send("Success!!");
    });
}

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.MAIL_ID,
        pass:process.env.MAIL_PASS,
    }
})

module.exports.send_reminder_mail = async () =>
{
    const reminders = await Reminder.find();
    let currDate = new Date();
    currDate.setHours(0,0,0,0);
    currDate = currDate.toUTCString();
    for (let i=0;i<reminders.length;i++)
    {
        let obj = reminders[i];
        if (obj.due_date.toUTCString() == currDate)
        {
            let user = await User.findOne({_id:obj.user_id});
            transporter.sendMail({
                from:"E.Tracker00@gmail.com",
                to:user.email,
                subject:'Reminder-Expense Tracker',
                text:`Amount: ${obj.amount}\nRelation: ${obj.relation}\nPerson: ${obj.person}`
            })
        }
    }
}