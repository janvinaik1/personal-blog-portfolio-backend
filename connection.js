const mongoose = require('mongoose');

async function connectMongoDb() {
    const mongoUrl = process.env.MONGODB_CONNECT_URL; 
    if (!mongoUrl) {
        console.error("MongoDB connection URL is missing.");
        return;
    }

    return mongoose.connect(mongoUrl)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = {
    connectMongoDb,
};

