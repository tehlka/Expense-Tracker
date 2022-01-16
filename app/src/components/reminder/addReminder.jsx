import React,{useState} from "react";
import {useHistory} from "react-router-dom";
import {IsAuth} from '../Helper/Auth';
import axios from 'axios';
import jwt_decode from "jwt-decode";

function showStatus(msg)
{
    let message = document.getElementById("formStatus");
    message.innerHTML = msg;
    message.hidden = false;
    setTimeout(()=>{message.hidden=true},1000);
}

async function handleSubmit(event)
{
    event.preventDefault();
    let amount = event.target.amount.value;
    let due_date = event.target.due_date.value;
    let relation = event.target.relation.value;
    let person = event.target.person.value;
    try{
        due_date = new Date(due_date+'T00:00:00');
        amount = Number(amount);
        if (due_date <= (new Date()) || amount < 1 || relation === '' || person === '')
            throw(Error("Invalid data"));
        let user_id = jwt_decode(localStorage.getItem("token")).id;
        await axios({
            method: 'post',
            url: '/add_reminder',
            headers: {'Content-Type' : 'application/json'},
            params: {user_id,amount,due_date,relation,person}
        }).then(()=>{
            showStatus("Success");
        },()=>{
            throw(Error("Invalid data"));
        })
    }catch(err){
        showStatus("Invalid Data");
    }
}

let auth = false;
let imageURL = "";
export default function AddReminder() {
    let history = useHistory();
    const [funcStatus,setFuncStatus] = useState(false);

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
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <label>Amount:
                    <input 
                        type="number" 
                        name="amount" 
                    />
                    </label>
                    <label>Due Date:
                    <input 
                        type="Date" 
                        name="due_date"
                    />
                    </label>
                    <label>Relation:
                    <select name="relation">
                        <option value="Lend">Lend</option>
                        <option value="Borrow">Borrow</option>
                    </select>
                    </label>
                    <label>Person:
                    <input 
                        type="String" 
                        name="person"
                    />
                    </label>
                    <input type="submit" />
                    <p hidden="true" id="formStatus">Success!!</p>
                </form>
            </div>
        );
    }
};