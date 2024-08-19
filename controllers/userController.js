const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
//@desc register a user
//@route POST / api/users/register
//@access public

const registerUser = asyncHandler(async (req , res) => {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("ALL FIELDS ARE MANDATORY!");
    }

    // Check if the user already exists
    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed password:", hashedPassword);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log(`user created ${user}`);

    if(user){
        res.status(201).json({_id: user.id, email: user.email});
    }else{
        res.status(400);
        throw new Error("user data is not valid")
    }

    res.status(201).json({ message: "User registered successfully" });

});


//@desc login a user
//@route POST / api/users/login
//@access public

const loginUser = asyncHandler(async (req , res) => {
   const {email , password} = req.body;
   if(!email || !password){
    res.status(400);
    throw new Error("all fields are mandatory!");
   }
   const user = await User.findOne({email});
   //compare password with hashedpassword
   if(user && (await bcrypt.compare(password , user.password))){
    const accessToken = jwt.sign({
        user:{
            username: user.username,
            email:user.email,
            id: user.id,
        },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m"}
  );
    res.status(200).json({accessToken});
   } else {
    res.status(401);
    throw new Error("email or password is not valid")
   }
});


//@desc current user info
//@route POST / api/users/current
//@access private

const currenterUser = asyncHandler(async (req , res) => {
    res.json(req.user);
});

module.exports = {registerUser , loginUser , currenterUser};