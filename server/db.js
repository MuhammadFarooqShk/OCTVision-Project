const mongoose = require('mongoose');
const url = "mongodb+srv://muhammadfarooqshk:Farooq123%40@cluster0.o5qru.mongodb.net/";

module.exports = ()=>{
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 30000, 
    };
    try{
        mongoose.connect(url,connectionParams);
        console.log('Connected to Database');
    } catch(error){
        console.log(error);
        console.log('Error Connecting to Database!');
    }
}