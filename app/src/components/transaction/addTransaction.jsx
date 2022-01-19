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
import './addTransaction.css'
import Header from '../header/header';

async function handleSubmit(date,amount,category,relation,person,setbuttonStatus)
{
    try{
        date.setHours(0,0,0,0);
        amount = Number(amount);
        let user_id = jwt_decode(localStorage.getItem("token")).id;
        await axios({
            method: 'post',
            url: '/add_transaction',
            headers: {'Content-Type' : 'application/json'},
            params: {user_id,amount,date,category,relation,person}
        }).then(()=>{
            setbuttonStatus(1);
            document.getElementById("transactionSubmit").innerHTML = "Success";
            setTimeout(()=>{window.location.reload(false);},1000)
        })
    }catch(err){
        setbuttonStatus(-1);
        document.getElementById("transactionSubmit").innerHTML = "Error";
        setTimeout(()=>{window.location.reload(false);},1000)
    }
}

function checkError(amount)
{
    return isNaN(parseFloat(amount)) || (!isFinite(amount)) || amount <= 0;
}

let auth = false;
let imageURL = "";
export default function AddTransaction() {
    let history = useHistory();
    const [funcStatus,setFuncStatus] = useState(false);
    const [categories,setCategories] = useState([""]);
    const [vendors,setVendors] = useState([""]);
    const [date, setDate] = useState(new Date());
    const [amount,setAmount] = useState(0);
    const [category,setCategory] = useState(null);
    const [vendor,setVendor] = useState(null);
    const [relation,setRelation] = useState("Credit");
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
        let user_id = jwt_decode(localStorage.getItem("token")).id;
        if (categories[0] === "")
        {
            axios({method: 'post',
            url: '/get_transaction_categories',
            headers: {'Content-Type' : 'application/json'},
            params: {user_id}})
            .then(response=>{
                setCategories(response.data);
            },error=>{console.log(error)});
        }
        if (vendors[0] === "")
        {
            axios({method: 'post',
            url: '/get_transaction_vendors',
            headers: {'Content-Type' : 'application/json'},
            params: {user_id}})
            .then(response=>{
                setVendors(response.data);
            });
        }
        return (
            <div className="transactionRoot">
                {Header(imageURL)}
                <div className="transactionStack">
                    <Stack spacing={2} sx={{ width: 300 }}>
                        <Autocomplete
                            id="transactionPerson"
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
                            renderInput={(params) => <TextField {...params} label="Vendor" />}
                        />
                        <Autocomplete
                            id="transactionCategory"
                            freeSolo
                            options={categories.map((option) => option)}
                            value={category}
                            onChange={(event,newValue)=>{
                                setCategory(newValue);
                            }}
                            onClose={(event)=>{
                                if (event.target.value !== 0)
                                    setCategory(event.target.value);
                            }}
                            renderInput={(params) => <TextField {...params} label="Category" />}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                id="transactionDate"
                                label="Date"
                                inputFormat="MM/dd/yyyy"
                                value={date}
                                maxDate={new Date()} 
                                onChange={(newValue)=>{setDate(newValue);}}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <FormControl fullWidth >
                            <InputLabel htmlFor="transactionAmount">Amount</InputLabel>
                            <OutlinedInput
                                id="transactionAmount"
                                startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                                label="Amount"
                                value={amount}
                                onChange={(event)=>{setAmount(event.target.value);}}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="inputlabel1">Type</InputLabel>
                            <Select
                                labelId="inputlabel1"
                                id="transactionRelation"
                                value={relation}
                                onChange={(event)=>{setRelation(event.target.value);}}
                            >
                                <MenuItem value={"Credit"}>Credit</MenuItem>
                                <MenuItem value={"Debit"}>Debit</MenuItem>
                            </Select>
                        </FormControl>
                        <Button 
                            id = "transactionSubmit"
                            variant="contained" 
                            color={(buttonStatus===0)?"primary":((buttonStatus===1)?"success":"error")}
                            onClick={()=>{
                                let ca = category;
                                let b1 = document.getElementById("transactionCategory").value;
                                if (ca !== b1)
                                    ca = b1;
                                let ve = vendor;
                                let b2 = document.getElementById("transactionPerson").value;
                                if (ve !== b2)
                                    ve = b2;
                                handleSubmit(date,amount,ca,relation,ve,setbuttonStatus);
                            }}
                            disabled={
                                vendor===""||
                                vendor===null||
                                vendor[0]===" "||
                                category===""||
                                category===null||
                                category[0]===" "||
                                checkError(amount)
                            }
                        >
                            Add Transaction
                        </Button>
                    </Stack>
                </div>
            </div>
        );
    }
};