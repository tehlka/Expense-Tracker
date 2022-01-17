import React,{useState} from "react";
import {useHistory} from "react-router-dom";
import {IsAuth} from '../Helper/Auth';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Header from '../header/header';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import Autocomplete from "@mui/material/Autocomplete";
import ReminderTable from '../table/reminderTable';
import './showReminder.css'

async function handleSubmit(start_date,end_date,relation,vendor,vendors,setbuttonStatus,setReminders)
{
    try{
        start_date.setHours(0,0,0,0);
        end_date.setHours(0,0,0,0);
        if (relation.length === 0)
            relation = ["Lend","Borrow"];
        if (vendor.length === 0)
            vendor = vendors;
        let user_id = jwt_decode(localStorage.getItem("token")).id;
        await axios({
            method: 'post',
            url: '/get_reminder',
            headers: {'Content-Type' : 'application/json'},
            params: {user_id,start_date,end_date,relation,vendor}
        }).then((response)=>{
            setbuttonStatus(1);
            setTimeout(()=>{setbuttonStatus(0);},1000)
            setReminders(response.data);
        },()=>{
            throw(Error("Invalid data"));
        })
    }catch(err){
        setbuttonStatus(-1);
        setTimeout(()=>{setbuttonStatus(0);},1000)
    }
}

let auth = false;
let flag = 1;
let imageURL = "";
export default function ShowReminder() {
    let history = useHistory();
    const [funcStatus,setFuncStatus] = useState(false);
    const [vendors,setVendors] = useState([""]);
    const [reminders,setReminders] = useState([]);
    const [startDate, setstartDate] = useState(new Date());
    const [endDate,setendDate] = useState(new Date());
    const [vendor,setVendor] = useState([]);
    const [relation,setRelation] = useState([]);
    const [buttonStatus,setbuttonStatus] = useState(0);

    if (!funcStatus){
        (async () => {
            let authObj = (await IsAuth());
            if (authObj.auth === true)
            {
                auth = true;
                imageURL = authObj.imageURL;
                setFuncStatus(true);
            }
            else
                setFuncStatus(true);
        })();
        return(
            <div>
                {Header(imageURL)}
                {ReminderTable(reminders)}
            </div>
        );
    }
    else{
        if (!auth)
            history.push('/');
        else
        {
            let user_id = jwt_decode(localStorage.getItem("token")).id;
            if (vendors[0] === "")
            {
                axios({method: 'post',
                url: '/get_reminder_vendors',
                headers: {'Content-Type' : 'application/json'},
                params: {user_id}})
                .then(response=>{
                    setVendors(response.data);
                });
            }
            if (reminders.length === 0 && flag === 1)
            {
                axios({method: 'post',
                url: '/get_all_reminders',
                headers: {'Content-Type' : 'application/json'},
                params: {user_id}})
                .then(response=>{
                    if (response.data.length !== 0)
                    {
                        let en = response.data[0].due_date;
                        for (let i=0;i<response.data.length;i++)
                        {
                            if (response.data[i].due_date < en)
                                en = response.data[i].due_date;
                        }
                        setstartDate(en);
                    }
                    setReminders(response.data);
                });
            }
        }
        return (
            <div>
                {Header(imageURL)}
                <div className="showReminder">
                    <div className="showReminderStack">
                        <Stack spacing={2} sx={{ width: 300 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    id="reminderStartDate"
                                    label="Start Date"
                                    inputFormat="MM/dd/yyyy"
                                    value={startDate}
                                    onChange={(newValue)=>{setstartDate(newValue);}}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    id="reminderEndDate"
                                    label="End Date"
                                    inputFormat="MM/dd/yyyy"
                                    value={endDate}
                                    onChange={(newValue)=>{setendDate(newValue);}}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <Autocomplete
                                multiple
                                id="showreminderVendor"
                                options={vendors}
                                getOptionLabel={(option) => option}
                                filterSelectedOptions
                                value={vendor}
                                onChange={(event,newValue)=>{
                                    setVendor(newValue);
                                }}
                                renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Person"
                                />
                                )}
                            />
                            <Autocomplete
                                multiple
                                id="showreminderRelation"
                                options={["Lend","Borrow"]}
                                getOptionLabel={(option) => option}
                                filterSelectedOptions
                                value={relation}
                                onChange={(event,newValue)=>{
                                    setRelation(newValue);
                                }}
                                renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Relation"
                                />
                                )}
                            />
                            <Button 
                                id = "showreminderSubmit"
                                variant="contained" 
                                color={(buttonStatus===0)?"primary":((buttonStatus===1)?"success":"error")}
                                onClick={(event)=>{
                                    handleSubmit(startDate,endDate,relation,vendor,vendors,setbuttonStatus,setReminders);
                                    if (event.isTrusted)
                                        flag = 0;
                                }}
                            >
                                Display Reminder
                            </Button>
                        </Stack>
                    </div>
                    <div className="showReminderTable">
                        {ReminderTable(reminders.sort((a,b)=>((a.due_date<b.due_date)?-1:1)))}
                    </div>
                </div>
            </div>
        );
    }
};