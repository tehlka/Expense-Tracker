import axios from 'axios'

async function IsAuth(){
    let auth = "";
    let imageURL = "";
    try{
        let ret = (await axios({method: 'post',
                    url: '/is_correct_user',
                    headers: {'Content-Type' : 'application/json'},
                    params:{token:localStorage.getItem('token')}})).data;
        imageURL = ret.imageURL;
        auth = true;    
    }catch(err){
       auth = false;
    }
    console.log({auth,imageURL});
    return {auth,imageURL};    
}

function LogOut(){
    localStorage.removeItem("token");
}

export {IsAuth,LogOut}