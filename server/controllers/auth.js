import bcrypt from "bcrypt";  //for password encryption
import jwt from "jsonwebtoken";
import user from "../models/user.js";
import User from "../models/user.js";

/* Register User */
export const register = async(req, res)=>{
    try{
        const{
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;     // Grab this from req.body

        const salt = await bcrypt.genSalt();    // Generate random slat provided by becrypt and use this salt for encryption
        const passwordHash = await bcrypt.hash(password,slat); //pass salt with password and hash then together

        const newUser = new Useer({
            firstName,
            lastName,
            email,
            password : passwordHash,  // password here is going ot be passwordHash
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random()*10000),  //not adding functionality just giving some random value
            impressions: Math.floor(Math.random()*10000)
        });
        const savedUser = await newUser.save() //saving the user
        res.status(201).json(savedUser);   //sending the status of 201 when upper info is received  .json for sending in proper format in json to frontend . frontend will also usue same format so that we dont have to convert it 
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

/* Logging in*/
export const login = async(req,res)=>{
    try{
        const{email,password} = req.body;   //fetch the entered email and password
        const user = await User.findOne({email:email})   //use mongoose to find the one having the specified email and put it in user

        if(!user) return res.status(400).json({msg:"User Does Not Exist."});   //if the user is not found

        const isMatch = await bcrypt.compare(password,user.password) ;   //if the password matches compare the password sent and the password user has in the database

        if(!isMatch) return res.status(400).json({msg: "Invalid Credentials"}); //if the password is incorrect

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)  ; //passing in the secret string,we will write our string in env file

        delete user.password;  //delete the password so that it doesnt gets sent back to frontend
        res.status(200).json({token,user});

    }catch(err){
        res.status(500).json({error:err.message})
    }
}