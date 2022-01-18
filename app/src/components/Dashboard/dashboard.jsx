import React,{useState} from "react";
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
            {
                auth = false;
                setFuncStatus(true);
            }              
        })();
        return(
            <div>
                {Header(imageURL)}
            </div>
        );
    }
    else{
        if (!auth)
            history.push("/");   
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