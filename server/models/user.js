const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
            type: String,
            required: true,
            minlength: 1,
            trim: true,
            unique: true,        // Ensure only 1 in the collection
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not valid'
            }
        },
        password: {
            type: String,
            require: true,
            minlength: 6
        },
        tokens: [{
            access: {
                type: String,
                require: true
            },
            token: {
                type: String,
                require: true
            }
        }]       
    });

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken =  function () {   // Why not use arrow function because due to binding of this keyword
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id, access }, "abc123").toString(); 
    user.tokens = user.tokens.concat({access, token});

    return user.save().then(() => {
        return token;
    });
}


UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
  
    try {
      decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    // match the token in the db
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
  };


var User = mongoose.model('User', UserSchema);


module.exports = {
    User
}