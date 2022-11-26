const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useUnifiedTopology: true, 
            useNewUrlParser: true, 
        });
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = connectDb;