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
import TransactionTable from '../table/transactionTable';
import './showTransaction.css'

async function handleSubmit(startDate,endDate,category,relation,vendor,categories,vendors,setbuttonStatus,setTransactions)
{
    try{
        startDate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);
        if (relation.length === 0)
            relation = ["Credit","Debit"];
        if (category.length === 0)
            category = categories;
        if (vendor.length === 0)
            vendor = vendors;
        let user_id = jwt_decode(localStorage.getItem("token")).id;
        await axios({
            method: 'post',
            url: '/get_transaction',
            headers: {'Content-Type' : 'application/json'},
            params: {user_id,startDate,endDate,relation,category,vendor}
        }).then((response)=>{
            setbuttonStatus(1);
            setTimeout(()=>{setbuttonStatus(0);},1000)
            setTransactions(response.data);
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
export default function ShowTransaction() {
    let history = useHistory();
    const [funcStatus,setFuncStatus] = useState(false);
    const [categories,setCategories] = useState([""]);
    const [vendors,setVendors] = useState([""]);
    const [transactions,setTransactions] = useState([]);
    const [startDate, setstartDate] = useState(new Date());
    const [endDate,setendDate] = useState(new Date());
    const [category,setCategory] = useState([]);
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
                {TransactionTable(transactions)}
            </div>
        );
    }
    else{
        if (!auth)
            history.push('/');
        else
        {
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
            if (transactions.length === 0 && flag === 1)
            {
                axios({method: 'post',
                url: '/get_all_transactions',
                headers: {'Content-Type' : 'application/json'},
                params: {user_id}})
                .then(response=>{
                    setTransactions(response.data);
                });
            }
        }
        return (
            <div>
                {Header(imageURL)}
                <div className="showTransaction">
                    <div className="showTransactionStack">
                        <Stack spacing={2} sx={{ width: 300 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    id="transactionStartDate"
                                    label="Start Date"
                                    inputFormat="MM/dd/yyyy"
                                    value={startDate}
                                    onChange={(newValue)=>{setstartDate(newValue);}}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    id="transactionEndDate"
                                    label="End Date"
                                    inputFormat="MM/dd/yyyy"
                                    value={endDate}
                                    onChange={(newValue)=>{setendDate(newValue);}}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <Autocomplete
                                multiple
                                id="showtransactionCategory"
                                options={categories}
                                getOptionLabel={(option) => option}
                                filterSelectedOptions
                                value={category}
                                onChange={(event,newValue)=>{
                                    setCategory(newValue);
                                }}
                                renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Category"
                                />
                                )}
                            />
                            <Autocomplete
                                multiple
                                id="showtransactionVendor"
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
                                    label="Vendor"
                                />
                                )}
                            />
                            <Autocomplete
                                multiple
                                id="showtransactionRelation"
                                options={["Credit","Debit"]}
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
                                id = "showtransactionSubmit"
                                variant="contained" 
                                color={(buttonStatus===0)?"primary":((buttonStatus===1)?"success":"error")}
                                onClick={(event)=>{
                                    handleSubmit(startDate,endDate,category,relation,vendor,categories,vendors,setbuttonStatus,setTransactions);
                                    if (event.isTrusted)
                                        flag = 0;
                                }}
                            >
                                Display Transaction
                            </Button>
                        </Stack>
                    </div>
                    <div className="showTransactionTable">
                        {TransactionTable(transactions.sort((a,b)=>((a.date<b.date)?-1:1)))}
                    </div>
                </div>
            </div>
        );
    }
};