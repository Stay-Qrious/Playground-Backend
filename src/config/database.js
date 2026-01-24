const mongoose = require('mongoose');

const connectDB = async () => {
    try {
       
        mongoose.connect(process.env.DbConnectionString);
       
    }
    catch (err) {
        console.error("Database connection error:", err.message);
    }
}



console.log("Database connection in progress...");

module.exports = connectDB();


