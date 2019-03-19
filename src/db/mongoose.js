const mongoose = require('mongoose');

// Connect to DB with mongoose
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

module.exports = mongoose;
