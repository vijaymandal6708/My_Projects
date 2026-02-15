import User from "../models/user.model.js";

const Signup = (req,res)=>{
    const {name, email, password, confirmpassword } = req.body;
    if(password !== confirmpassword){
        return res.status(400).json({message:"Passwords do not match"});
    }
    const user = User.findOne({email})
    if(user){
        return res.status(400).json({message: "Email already exists"});
    }
    const newUser = new User({
        name,
        email,
        password,
    });
    newUser
     .save()
     .then(()=>{
        res.status(201).json({message: "User registerd successfully"});
     });
};