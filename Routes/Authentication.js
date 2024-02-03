const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const secretKey = "Mn1a5meis1$noldo2kdygfb67bxdf5r"
// -----------create user-----------

router.post("/createuser",[
    body('email').isEmail(),
    body('name').isLength({min: 2}),
    body('password','Incorrect Password').isLength({min: 5})
], async(req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    //--------- hashing start------

const salt = await bcrypt.genSalt(10);
let secPassword = await bcrypt.hash(req.body.password,salt);
    //--------- hashing end------
try{
   await User.create({
        name: req.body.name,
        password:secPassword,
        email: req.body.email,
        location: req.body.location
    })
    res.json({success:true});
}catch(err){

    console.log(err);
    res.json({success:false});
}
});
//-------------login user------------

router.post("/loginuser",[
    body('email').isEmail(),
    body('password','Incorrect Password').isLength({min: 5})
],  async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }


let email = req.body.email;

try{
  let userData = await User.findOne({email});
  if(!userData) {
    return res.status(400).json({errors: "Try logging with correct credentials"})
  }
// ------hacking compare start--------
const pwdCompare = await bcrypt.compare(req.body.password, userData.password);

// ------hacking compare end--------


  if(!pwdCompare){
    return res.status(400).json({errors: "Try logging with correct credentials"})

  }

//----------jwt Token start---------

const data = {
    user:{
        id:userData.id
    }
}
const authToken = jwt.sign(data, secretKey);
// console.log("Generated Auth Token:", authToken);
return res.json({ success: true, authToken: authToken });


//----------jwt Token end---------



}catch(err){

    // console.log(err);
    res.json({success:false});
}
});

module.exports = router;