const mongoose = require('mongoose');
const connectTomongo = async () => {
    try {
        await mongoose.connect('mongodb+srv://dhruvdwivedi2304:vinay@cluster0.ymzpx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
         });
         console.log("We are connected to the MongoDB Server");
    } catch (error) {
       console.log("Something error while connecting to the databse");
    }
}

module.exports = connectTomongo;