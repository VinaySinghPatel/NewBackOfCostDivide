const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemDeatailSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'yourid', 
        required : true,
        unique: true 
     },
    MainGroupName : {
    type : String,
    required : true
  } ,
   Peoples : {
    type : Number,
    required : true
  } ,   phoneNumber : {
    type : [String],
    required : true
  } ,
  totalinvest : {
    type: Number,
    required : true
  },
     fromdate : {
    type:Date,
    default : Date.now
  }
});

const useer = mongoose.model('group',ItemDeatailSchema);
module.exports = useer;