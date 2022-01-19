import React,{useState,useEffect} from "react";
import {useHistory} from "react-router-dom";
import {IsAuth} from '../Helper/Auth';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import './addReminder.css'
import Header from '../header/header';

async function handleSubmit(due_date,amount,relation,person,setbuttonStatus)
{
    try{
        due_date.setHours(0,0,0,0);
        amount = Number(amount);
        let user_id = jwt_decode(localStorage.getItem("token")).id;
        await axios({
            method: 'post',
            url: '/add_reminder',
            headers: {'Content-Type' : 'application/json'},
            params: {user_id,amount,due_date,relation,person}
        }).then(()=>{
            setbuttonStatus(1);
            document.getElementById("reminderSubmit").innerHTML = "Success";
            setTimeout(()=>{window.location.reload(false);},1000)
        })
    }catch(err){
        setbuttonStatus(-1);
        document.getElementById("reminderSubmit").innerHTML = "Error";
        setTimeout(()=>{window.location.reload(false);},1000)
    }
}

function checkError(amount)
{
    return isNaN(parseFloat(amount)) || (!isFinite(amount)) || amount <= 0;
}

let auth = false;
let imageURL = "";
export default function AddReminder() {
    let history = useHistory();
    const [funcStatus,setFuncStatus] = useState(false);
    const [vendors,setVendors] = useState([""]);
    const [date, setDate] = useState(new Date());
    const [amount,setAmount] = useState(0);
    const [vendor,setVendor] = useState(null);
    const [relation,setRelation] = useState("Lend");
    const [buttonStatus,setbuttonStatus] = useState(0);

    // for cleanup, useEffect will be called when component unmounts
    useEffect(()=>{
        let isCancelled = false;
        (async () => {
            let authObj = (await IsAuth());
            if (authObj.auth === true)
            {
                auth = true;
                imageURL = authObj.imageURL;
                if (!isCancelled)
                    setFuncStatus(true);
            }
            else
            {
                auth = false;
                if (!isCancelled)
                    setFuncStatus(true);
            }              
        })();
        return ()=>{
            isCancelled=true;
        };
    },[]);
    // https://stackoverflow.com/questions/52912238/render-methods-should-be-a-pure-function-of-props-and-state
    useEffect(()=>{
        if (funcStatus && (!auth))
            history.push('/');
    },[funcStatus,history]);
    if ((!funcStatus) || (!auth)){
        return(
            <div style={{visibility:'hidden'}}>
                {Header(imageURL)}
            </div>
        );
    } 
    else{
        if (vendors[0] === "")
        {
            let user_id = jwt_decode(localStorage.getItem("token")).id;
            axios({method: 'post',
            url: '/get_reminder_vendors',
            headers: {'Content-Type' : 'application/json'},
            params: {user_id}})
            .then(response=>{
                setVendors(response.data);
            });
        }
        return (
            <div className="reminderRoot">
                {Header(imageURL)}
                <div className="reminderStack">
                    <Stack spacing={2} sx={{ width: 300 }}>
                        <Autocomplete
                            id="reminderPerson"
                            freeSolo
                            options={vendors.map((option) => option)}
                            value={vendor}
                            onChange={(event,newValue)=>{
                                setVendor(newValue);
                            }}
                            onClose={(event)=>{
                                if (event.target.value !== 0)
                                    setVendor(event.target.value);
                            }}
                            renderInput={(params) => <TextField {...params} label="Person" />}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                id="reminderDate"
                                label="Date"
                                inputFormat="MM/dd/yyyy"
                                value={date}
                                maxDate={new Date()} 
                                onChange={(newValue)=>{setDate(newValue);}}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <FormControl fullWidth >
                            <InputLabel htmlFor="reminderAmount">Amount</InputLabel>
                            <OutlinedInput
                                id="reminderAmount"
                                startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                                label="Amount"
                                value={amount}
                                onChange={(event)=>{setAmount(event.target.value);}}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="inputlabel2">Type</InputLabel>
                            <Select
                                labelId="inputlabel2"
                                id="reminderRelation"
                                value={relation}
                                onChange={(event)=>{setRelation(event.target.value);}}
                            >
                                <MenuItem value={"Lend"}>Lend</MenuItem>
                                <MenuItem value={"Borrow"}>Borrow</MenuItem>
                            </Select>
                        </FormControl>
                        <Button 
                            id = "reminderSubmit"
                            variant="contained" 
                            color={(buttonStatus===0)?"primary":((buttonStatus===1)?"success":"error")}
                            onClick={()=>{
                                let ve = vendor;
                                let b1 = document.getElementById("reminderPerson").value;
                                if (ve !== b1)
                                    ve = b1;
                                handleSubmit(date,amount,relation,ve,setbuttonStatus);
                            }}
                            disabled={
                                vendor===""||
                                vendor===null||
                                vendor[0]===" "||
                                checkError(amount)
                            }
                        >
                            Add Reminder
                        </Button>
                    </Stack>
                </div>
            </div>
        );
    }
};