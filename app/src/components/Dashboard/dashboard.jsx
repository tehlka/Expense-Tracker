import React,{useEffect, useState} from "react";
import {useHistory} from "react-router-dom"
import {IsAuth} from '../Helper/Auth';
import Header from '../header/header';
import './dashboard.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

let auth = false;
let imageURL = "";
export default function Dashboard() {
    let history = useHistory();
    const [funcStatus,setFuncStatus] = useState(false);
    
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
            <div className="dashboardRoot">
                {Header(imageURL)}
                <div className="dashboardButton">
                    <Stack spacing={4} sx={{ width: 300 }}>
                        <Button
                            variant="contained"
                            onClick={()=>{
                                history.push("/add_transaction");
                            }}>
                            Add transaction
                        </Button>
                        <Button 
                            variant="contained"
                            onClick={()=>{
                                history.push("/show_transaction");
                            }}>
                            DISPLAY transaction
                        </Button>
                        <Button
                            variant="contained"
                            onClick={()=>{
                                history.push("/add_reminder");
                            }}>
                            Add reminder
                        </Button>
                        <Button 
                            variant="contained"
                            onClick={()=>{
                                history.push("/show_reminder");
                            }}>
                            DISPLAY reminder
                        </Button>
                        <Button 
                            variant="contained"
                            onClick={()=>{
                                history.push("/spend_analytics");
                            }}>
                            SPEND ANALYTICS
                        </Button>
                    </Stack>
                </div>
            </div>
        );
    }
}