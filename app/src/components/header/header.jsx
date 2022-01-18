import './header.css';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import {LogOut} from '../Helper/Auth';
import {useHistory} from "react-router-dom"
const logo = require("../assets/logo.jpg"); 

export default function Header(imageURL)
{
    let history = useHistory();
    let show = true;
    if (window.location.href.slice(-1) === '/')
        show = false;
    return(
        <div className="heading">
            <div className='headingText'>
                <img src={logo} alt="logo" className='headingLogo'/>
                <h1 className='headingH1'>Expense Tracker</h1>
                <h3 className='headingH3'>A one stop solution to manage all expenses</h3>
            </div>
            <div className='headingButton' style={{"visibility":(show?"visible":"hidden")}}>
                <img
                    id="headerAvatar"
                    onClick={() => {
                        history.push("/");
                    }}
                    src={imageURL}
                    alt='avatar'
                    />
                <Button
                    className='headingLogout'
                    size='large'
                    endIcon={<LogoutIcon />}
                    onClick={()=>{
                        LogOut();
                        window.location.reload(false);
                    }}
                >
                </Button>
            </div>
        </div>
    );
}