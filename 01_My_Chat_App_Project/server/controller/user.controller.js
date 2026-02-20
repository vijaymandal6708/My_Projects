import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/generateToken.js";

export const signup = async (req, res) => {
  try {
    console.log(req.body);
    const { fullname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords not match" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      createTokenAndSaveCookie(newUser._id, res);
      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          name: newUser.fullname,
          email: newUser.email,
        },
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({email});
    const isMatch = await bcrypt.compare(password, user.password);
    if(!user || !isMatch){
        return res.status(404).json({message:"invalid email or password"});
    }
    createTokenAndSaveCookie(user._id, res);
    res.status(201).json({
        message:"User logged in successfully", 
        user:{
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
          },
        });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = async (req,res)=>{
    try {
       res.clearCookie('jwt');
       res.status(200).json({message:"User logged out successfully"}) 
    } catch (error) {
       console.log(error);
       res.status(500).json({message:"Server Error"});
    }
};

export const getUserInfo = async (req,res)=>{
  try {
    const loggedInUser = req.user._id;
    const fillteredUsers = await User.find({_id: {$ne:loggedInUser}}).select("-password");
    res.status(201).json(fillteredUsers);

  } catch (error) {
    console.log("error in getAllUsers controller:"+ error);
    res.status(500).json({message:"Server Error"});
  }
}
