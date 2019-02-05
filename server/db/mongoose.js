var mongoose = require('mongoose');

// Tell mongoose which Promise library to use
mongoose.Promise = global.Promise;
// Connect to DB with mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};