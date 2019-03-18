var mongoose = require('mongoose');

// Tell mongoose which Promise library to use
mongoose.Promise = global.Promise;
// Connect to DB with mongoose
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

module.exports = {
    mongoose
};