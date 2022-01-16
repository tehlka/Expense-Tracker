const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const cron = require('node-cron');
const control = require('./controllers/dataController');

dotenv.config();
mongoose.connect(process.env.DB_CONNECT_URI,{},()=>console.log('connected to db'));

app.use(authRoutes);
app.use(express.json());
app.use(cors());

cron.schedule('0 0 * * *',control.send_reminder_mail);

app.listen(3001,function(){
    console.log("Server running on port 3001");
});