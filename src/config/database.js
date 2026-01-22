const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect('mongodb+srv://abhishek_tripathi_wk:PlaygroundDbPassword@playgroundcluster.w59s6yz.mongodb.net/?appName=PlaygroundCluster');
       
    }
    catch (err) {
        console.error("Database connection error:", err.message);
    }
}



console.log("Database connection in progress...");

module.exports = connectDB();


