const express = require('express');
const ShopUser = require('../schema/user');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_Token = 'VinaySinghPatel';
const fetchuser = require('../middleware/UserAuth');

router.post('/newuser',[
  body('name').notEmpty().withMessage('Shop User name is required'),
  body('GroupName').notEmpty().withMessage('Group Name is required'),
  body('cityname').notEmpty().withMessage('City Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password 8 Character ka Hona Chaiye.'),
  body('mobilenumber').isLength({max : 10}).withMessage("Please Enter valid Mobile Number"),
], async (req,res) => {
    let Success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({Success, errors: errors.array() });
    }
    // const existingShopUsername = await ShopUser.findOne({ ShopUsername: req.body.ShopUsername });
    // if (existingShopUsername) {
    //     return res.status(400).json({ error: "ShopUsername is already taken., PLease enter a unique  ShopUsername" }
    //     );
    // }
    try {
        let Shopuser = await ShopUser.findOne({email : req.body.email});
    if(Shopuser){
        res.status(400).json({Success,error: "Ye Shop User Pehle Se HAi Sorry "});
    }
   
    const salt = await bcrypt.genSaltSync(10);
    const SecPass = await bcrypt.hash(req.body.password,salt);
     Shopuser = await ShopUser.create({
        GroupName : req.body.GroupName,
        cityname : req.body.cityname,
        name : req.body.name,
        email : req.body.email,
        password : SecPass,
        mobilenumber : req.body.mobilenumber
    })
        const data = {
            Shopuser : {
                id : ShopUser.id
            }
        }
        const AuthenticationData = jwt.sign(data,jwt_Token);
        const dataa = await ShopUser.id;
        Success = true;
        res.json({Success,AuthenticationData,dataa});
    } catch (error) {
        console.log("Error While Creating the New ShopUser",error.message);
        res.status(400).json("There is an Error Occured while ShopUser Creation");
    }
});


router.post('/userLogin',[
    body('email').isEmail().withMessage('Not a valid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ],async (req,res)=>{
      let Succes = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ Succes, errors: errors.array() });
    }
    const {email,password} = req.body;
    try {
    const Shopuser = await ShopUser.findOne({email});
      if(!Shopuser){
          return res.status(401).json({Succes,error : "Ye Gmail galat hai"});
      }
  
   // const PassCompare = await bcrypt.compare(password,ShopUser.password);
    const PassCompare = await Shopuser.password;
    if(!PassCompare){
      return res.status(401).json({error:"The Pass is Not Correct"});
    }
  
    const ShopUserId = {
     Shopuser :  {
      id : Shopuser.id
    }}
  
      // Yaha per sign kr rahe kyu ham crediatial se login kar rahe hai 
    const Authtoken = await jwt.sign(ShopUserId,jwt_Token);
    const dataa = await Shopuser.id;
    Succes = true;
    res.json({Succes : "Succesfully Login",Authtoken,dataa})
  } catch (error) {
    console.error(error.message);
    console.log("There is an error in Email Pass Login ");
  }
   
  })
  
  
  router.get('/UserProfile/:id', async (req, res) => {
    try {
      const ShopUserId = req.params.id;
  
      const Shopuser = await ShopUser.findById(ShopUserId);
  
      if (!Shopuser) {
        return res.status(404).json({ message: 'ShopUser not found' });
      }
  
      res.status(200).json(Shopuser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.put('/updateprofile/:id',async(req,res)=>{
    try {
      let Success = false;
      const { name,GroupName,cityname } = req.body;
      const profileid = await ShopUser.findById(req.params.id);
      if (!profileid) {
          return res.status(404).json("Answer not found");
      }
      // if(profileid.userId.toString() !== req.user.id){
      //     return  res.status(401).send("Not Allowed For You");
      // }
      // if (!post.userId || post.userId.toString() !== req.user.id) {
      //     console.log("req.user.id:", req.user.id);
      //     return res.status(403).json("Unauthorized to update this post");
      // }
      let NewProfile = {};
      if (name){ NewProfile.name = name};
      if (GroupName){ NewProfile.GroupName = GroupName};
      if (name){ NewProfile.cityname = cityname};
      const updatedProfile = await ShopUser.findByIdAndUpdate(req.params.id, { $set: NewProfile }, { new: true });
      Success = true;
      res.json({Success,updatedProfile});
  } catch (error) {
      console.error("Error updating post:", error.message);
      res.status(500).send("There is an error in the update post API");
  }
  })


module.exports = router;