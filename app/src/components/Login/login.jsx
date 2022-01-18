import React,{useState} from "react";
import { GoogleLogin } from "react-google-login";
import axios from 'axios';
import {useHistory} from "react-router-dom";
import {IsAuth} from '../Helper/Auth';
import "./login.css";
import Header from '../header/header';
import {GoogleButton} from 'react-google-button'

let auth = false;
export default function Login() {
    let history = useHistory();

    async function google_submit(response) {
        console.log(response.profileObj);
        const email = response.profileObj.email;        
        const username = response.profileObj.name;
        const imageURL = response.profileObj.imageUrl;
        const token = await axios({
            method: 'post',
            url: '/Osignup_user',
            headers: {'Content-Type' : 'application/json'},
            params: {username,email,imageURL}
        })
        localStorage.setItem("token",token.data);
        history.push("/dashboard");
    }
    
    const [funcStatus,setFuncStatus] = useState(false);

    if (!funcStatus){
        (async () => {
            if ((await IsAuth()).auth === true)
            {
                auth = true;
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
                {Header("")}
            </div>
        );
    }        
    else{
        if (auth)
            history.push('/dashboard');
        return (
            <div className="loginRoot">
                {Header("")}
                <div className="googleDiv">
                    <GoogleLogin
                        clientId="883199397616-kfl1toivt3hd531dif6hrd6u18pbseq2.apps.googleusercontent.com"
                        render={renderProps => (
                        <GoogleButton onClick={renderProps.onClick} disabled={renderProps.disabled}>Sign in with Google</GoogleButton>
                        )}
                        onSuccess={(response) => {
                            google_submit(response);
                        }}
                        onFailure={(err) => {
                            console.log(err);
                        }}
                    />
                </div>
            </div>
        );
    }
}