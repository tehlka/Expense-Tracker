import React,{useState,useEffect} from "react";
import {useHistory} from "react-router-dom";
import {IsAuth} from '../Helper/Auth';
import { Chart } from "react-google-charts";
import Header from '../header/header';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import './spendAnalytics.css';
import SpendTable from '../table/spendTable';

async function handleSubmit(startDate,endDate,relation,setbuttonStatus,setTransactions,setTransactions1,setTransactions2,setcreditSum,setdebitSum)
{
    try{
        startDate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);
        let user_id = jwt_decode(localStorage.getItem("token")).id;
        await axios({
            method: 'post',
            url: '/get_all_transactions_by_date',
            headers: {'Content-Type' : 'application/json'},
            params: {user_id,startDate,endDate}
        }).then((response)=>{
            let trans = response.data
            let chart1 = [["Category","Spending"]];
            let chart2 = [["Category","Spending"]];
            let chart3 = [["Category","Spending"]];
            const map1 = new Map();
            const map2 = new Map();
            const map3 = new Map();
            let creditSum = 0;
            let debitSum = 0;
            for (let i=0;i<trans.length;i++)
            {
                let x = trans[i]
                if (x.relation === "Credit")
                    creditSum += x.amount;
                else
                    debitSum += x.amount;
                if (x.relation !== relation)
                    continue;
                if (map1.has(x.category))
                    map1.set(x.category,map1.get(x.category)+x.amount);
                else
                    map1.set(x.category,x.amount);
                if (map2.has(x.person))
                    map2.set(x.person,map2.get(x.person)+x.amount);
                else
                    map2.set(x.person,x.amount);
                let y = (new Date(x.date)).toLocaleDateString("en-US",{ year:'numeric',month:'long',day:'numeric'})
                if (map3.has(y))
                    map3.set(y,map3.get(y)+x.amount);
                else
                    map3.set(y,x.amount);
            }
            const iterator1 = map1[Symbol.iterator]();
            for (const item of iterator1)
                chart1.push(item);
            const iterator2 = map2[Symbol.iterator]();
            for (const item of iterator2)
                chart2.push(item);
            const iterator3 = map3[Symbol.iterator]();
            for (const item of iterator3)
                chart3.push(item);
            setTransactions(chart1);
            setTransactions1(chart2);
            setTransactions2(chart3);
            setcreditSum(creditSum)
            setdebitSum(debitSum)
            document.getElementsByClassName("spendTable")[0].style.visibility = "visible";
            if (chart1.length > 1)
                document.getElementsByClassName("categoryChart")[0].style.visibility = "visible";
            else
                document.getElementsByClassName("categoryChart")[0].style.visibility = "hidden";
            if (chart3.length > 1)
                document.getElementsByClassName("dateChart")[0].style.visibility = "visible";
            else
                document.getElementsByClassName("dateChart")[0].style.visibility = "hidden";
            if (chart2.length > 1)
                document.getElementsByClassName("vendorChart")[0].style.visibility = "visible";
            else
                document.getElementsByClassName("vendorChart")[0].style.visibility = "hidden";
            setbuttonStatus(1);
            document.getElementById("spendSubmit").innerHTML = "Success";
            setTimeout(()=>{
                setbuttonStatus(0);
                document.getElementById("spendSubmit").innerHTML = "SHOW ANALYTICS";
            },1000)
        },()=>{
            throw(Error("Invalid data"));
        })
    }catch(err){
        setbuttonStatus(-1);
        document.getElementById("spendSubmit").innerHTML = "Error";
        setTimeout(()=>{
            setbuttonStatus(0);
            document.getElementById("spendSubmit").innerHTML = "SHOW ANALYTICS";
        },1000)
    }
}

let auth = false;
let imageURL = "";
export default function SpendAnalytics() {
    let history = useHistory();
    const [funcStatus,setFuncStatus] = useState(false);
    const [transactions,setTransactions] = useState([["Category","Spending"]]);
    const [transactions1,setTransactions1] = useState([["Category","Spending"]]);
    const [transactions2,setTransactions2] = useState([["Category","Spending"]]);
    const [startDate, setstartDate] = useState(new Date());
    const [endDate,setendDate] = useState(new Date());
    const [relation,setRelation] = useState("Credit");
    const [buttonStatus,setbuttonStatus] = useState(0);
    const [creditSum,setcreditSum] = useState(0);
    const [debitSum,setdebitSum] = useState(0);

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
            <div>
                {Header(imageURL)}
            </div>
        );
    }  
    else{
        return (
            <div>
                {Header(imageURL)}
                <div className="spendRoot">
                    <div className="spendLayer1">
                        <div className="spendStack">
                            <Stack spacing={2} sx={{ width: 300 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        id="spendStartDate"
                                        label="Start Date"
                                        inputFormat="MM/dd/yyyy"
                                        value={startDate}
                                        onChange={(newValue)=>{setstartDate(newValue);}}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        id="spendEndDate"
                                        label="End Date"
                                        inputFormat="MM/dd/yyyy"
                                        value={endDate}
                                        onChange={(newValue)=>{setendDate(newValue);}}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                <FormControl fullWidth>
                                    <InputLabel id="inputlabel">Type</InputLabel>
                                    <Select
                                        labelId="inputlabel"
                                        id="spnedRelation"
                                        value={relation}
                                        onChange={(event)=>{setRelation(event.target.value);}}
                                    >
                                        <MenuItem value={"Credit"}>Credit</MenuItem>
                                        <MenuItem value={"Debit"}>Debit</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button 
                                    id = "spendSubmit"
                                    variant="contained" 
                                    color={(buttonStatus===0)?"primary":((buttonStatus===1)?"success":"error")}
                                    onClick={(event)=>{
                                        handleSubmit(startDate,endDate,relation,setbuttonStatus,
                                        setTransactions,setTransactions1,setTransactions2,setcreditSum,setdebitSum);
                                    }}
                                >
                                    SHOW ANALYTICS
                                </Button>
                            </Stack>
                        </div>
                        <div className="dateChart">
                            <Chart       
                                chartType="PieChart"
                                data={transactions2}
                                options={{
                                    title: "By Date",
                                    is3D: true}
                                }
                                width={"40vw"}
                                height={"400px"}
                            />
                        </div>
                        <div className="spendTable">
                            {SpendTable(creditSum,debitSum)}
                        </div>
                    </div>
                    <div className="spendLayer2">
                        <div className="categoryChart">
                            <Chart
                                chartType="PieChart"
                                data={transactions}
                                options={{
                                    title: "By Category",
                                    is3D: true}
                                }
                                width={"40vw"}
                                height={"400px"}
                            />
                        </div>
                        <div className="vendorChart">
                            <Chart
                                chartType="PieChart"
                                data={transactions1}
                                options={{
                                    title: "By Vendor",
                                    is3D: true}
                                }
                                width={"40vw"}
                                height={"400px"}
                            />
                        </div>  
                    </div>
                </div>
            </div>
        );
    }
};