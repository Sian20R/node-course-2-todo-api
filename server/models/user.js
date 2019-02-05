var mongoose = require('mongoose');

var User = mongoose.model('User', new mongoose.Schema({
    email: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        }       
    })
);


module.exports = {
    User
}