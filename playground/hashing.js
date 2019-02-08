const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Password with salt technique
var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});


// Take the hashPassword compare with the plain text password
var hashPassword = '$2a$10$qxfK9nUcB9dAjeQpFl.BauzL3vTazJWfkfMkZM2wETfOkL5mxnLPq';

bcrypt.compare(password, hashPassword, (err, res) => {
    console.log(res);
});


// var data = {
//     id: 10
// };

// // Takes the object in this case the data with User Id and signs it. It creates that hash and then it returns the token value.
// var token = jwt.sign(data, '123abc'); // 1st para: payload, 2nd para: secretOrPrivateKey
// console.log(token);


// // Does the opposite. It takes the token and the secret, make sure that data is not manipulated.
// var decoded = jwt.verify(token, '123abc'); // 1st para: token, 2nd para: secretOrPrivateKey
// console.log('decoded', decoed);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4 
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// token.hash = SHA265(JSON.stringify(data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash)
//     console.log('Data was not changed');
// else
//     console.log('Data was changed. Do not trust')