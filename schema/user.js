const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShopUserSchema = new Schema({
  name :{
    type : String,
    required : true
  } , 
  GroupName :{
    type : String,
    required : true
  } ,
  cityname : {
    type : String, 
    required : true
    }, 
    email :{
    type : String,
    required : true
  } , 
  mobilenumber :{
    type : String,
    required : true
  } ,
   password :{
    type : String,
    required : true
  } , fromdate : {
    type:Date,
    default : Date.now
  }
});

const userId = mongoose.model('yourid',ShopUserSchema);
module.exports = userId;