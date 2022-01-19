import React,{useState,useEffect} from "react";
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

    // for cleanup, useEffect will be called when component unmounts
    useEffect(()=>{
        let isCancelled = false;
        (async () => {
            let authObj = (await IsAuth());
            if (authObj.auth === true)
            {
                auth = true;
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
        if (funcStatus && auth)
            history.push('/dashboard');
    },[funcStatus,history]);
    if ((!funcStatus) || auth){
        return(
            <div>
                {Header("")}
            </div>
        );
    }        
    else{
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