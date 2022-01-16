import React,{useState} from "react";
import {useHistory} from "react-router-dom";
import {IsAuth} from '../Helper/Auth';
import axios from 'axios';
import jwt_decode from "jwt-decode";

function showStatus(msg)
{
    let message = document.getElementById("formStatus");
    message.innerHTML = msg;
    message.style.visibility = "visible";
    setTimeout(()=>{message.style.visibility="hidden"},1000);
}

function getValue(arr)
{
    let newArr = [];
    for (let i=0;i<arr.length;i++)
    {
        if (arr[i].checked)
            newArr.push(arr[i].value);
    }
    if (newArr.length === 0)
    {
        for (let i=0;i<arr.length;i++)
            newArr.push(arr[i].value);            
    }
    return newArr;
}

async function handleSubmit(event,setTransactions)
{
    event.preventDefault();
    let start_date = event.target.start_date.value;
    let end_date = event.target.end_date.value;
    let relation = event.target.relation;
    let vendor = event.target.vendor;
    try{
        if (vendor[0] === undefined)
            vendor = [vendor];
        if (start_date === '')
            start_date = '0000-01-01';
        if (end_date === '')
            end_date = '9999-12-31';
        start_date = new Date(start_date+'T00:00:00');
        end_date = new Date(end_date+'T00:00:00');
        let relations = getValue(relation);
        let vendors = getValue(vendor);
        let user_id = jwt_decode(localStorage.getItem("token")).id;
        await axios({
            method: 'post',
            url: '/get_reminder',
            headers: {'Content-Type' : 'application/json'},
            params: {user_id,start_date,end_date,relations,vendors}
        }).then((response)=>{
            showStatus("Success");
            setTransactions(response.data);
        },()=>{
            throw(Error("Invalid data"));
        })
    }catch(err){
        showStatus("Invalid Data");
    }
}

let auth = false;
let imageURL = "";
export default function ShowReminder() {
    let history = useHistory();
    const [funcStatus,setFuncStatus] = useState(false);
    const [vendors,setVendors] = useState([""]);
    const [reminders,setReminders] = useState([]);

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
            <div></div>
        );
    }
    else{
        if (!auth)
            history.push('/');
        else
        {
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
        }
        if (vendors.length === 0)
            return (
                <div>
                    <h1>No Reminder</h1>
                </div>
            );
        return (
            <div>
                <form onSubmit={async (event)=>{
                    handleSubmit(event,setReminders);
                }}>
                    <div>
                        <label> Start Date: </label>
                        <input 
                            type="Date" 
                            name="start_date"
                        />
                    </div>
                    <div>
                        <label> End Date: </label>
                        <input 
                            type="Date" 
                            name="end_date"
                        />
                    </div>
                    <div>
                        <label> Relation: </label>
                        <label> Lend </label>
                        <input
                            type="checkbox"
                            name="relation"
                            value="Lend"
                        />
                        <label> Borrow </label>
                        <input
                            type="checkbox"
                            name="relation"
                            value="Borrow"
                        />
                    </div>
                    <div>
                        <label> Person: </label>
                        {vendors.map((name,index)=>{
                            return(
                                <div style={{display: "inline"}} key={3*index}>
                                    <label key={3*index+1}> {name} </label>
                                    <input
                                        key={3*index+2}
                                        type="checkbox"
                                        name="vendor"
                                        value={name}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <input id="submitButton" type="submit" style={{display: "inline"}}/>
                        <p style={{display: "inline",visibility:"hidden"}} id="formStatus">Success!!</p>
                    </div>
                </form>
                <div>
                    {reminders.map((object,index)=>{
                        return(
                            <div key={6*index}>
                                <p key={6*index+1} style={{display: "inline"}}>{(new Date(object.due_date)).toLocaleDateString("en-US",{ year:'numeric',month:'long',day:'numeric'})} </p>
                                <p key={6*index+2} style={{display: "inline"}}>{object.person} </p>
                                <p key={6*index+3} style={{display: "inline"}}>{object.relation} </p>
                                <p key={6*index+4} style={{display: "inline"}}>{object.amount} </p>
                                <button key={6*index+5} onClick={async (event)=>{
                                    event.preventDefault();
                                    let reminder_id = object._id;
                                    await axios({
                                        method: 'post',
                                        url: '/delete_reminder',
                                        headers: {'Content-Type' : 'application/json'},
                                        params: {reminder_id}
                                    }).then(()=>{
                                        document.getElementById("submitButton").click();
                                    })
                                }} style={{display: "inline"}}> Delete </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
};