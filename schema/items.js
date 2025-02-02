const mongoose = require('mongoose');
const {Schema} = mongoose;

const ItemSchema = new Schema(
{
         GroupName : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'group', 
            required : true
         },
    itemname : {
        type : String,
        required : true
    },
    itemCost : {
        type : Number,
        required : true
    },
    fromdate : {
        type : Date,
        default : Date.now
    }
}
);

const itemdeatail = mongoose.model('item',ItemSchema);
module.exports = itemdeatail;
