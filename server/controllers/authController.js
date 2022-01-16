const jwt = require('jsonwebtoken');
const User = require('../schemas/User');

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{
        expiresIn: '1h'
    });
};

module.exports.user_login = async (req,res) =>
{
    const {username,email,imageURL} = req.query;
    queryObject = await User.find({email:email});
    console.log(username,email,imageURL,queryObject);
    if (queryObject.length != 0)
    {
        await User.updateOne({email:email},{$set:{imageURL:imageURL}});
        const token = createToken(queryObject[0]._id);
        res.status(201).send(token);
    }
    else
    {
        const user = await User.create({username,email,imageURL});
        const token = createToken(user._id);
        res.status(201).send(token);
    }
}

module.exports.is_correct_user = async (req,res) =>
{
    try{
        const {token} = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({_id:decoded.id});
        console.log(user);
        const imageURL = user.imageURL; 
        console.log(imageURL);
        return res.status(200).send({user:decoded.id,imageURL:imageURL});
    }catch(err){
        return res.status(403).send("invalid token");
    }   
}