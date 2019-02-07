const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5c594cf83170fb0681f6a5bd';

// if (!ObjectID.isValid) 
//     console.log('Id is not valid')


// // Return aray of docs
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// // Retreive the first one, return single doc
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });


// // Find doc by their identifier
// Todo.findById({
//     _id: id
// }).then((todo) => {
//     if (!todo)
//         return console.log(`${id} not found`)
//     console.log('Todo By Id', todo);
// }).catch(err => console.log(err));

var id = '5c5938eeb346cb0385880b3e';

if (!ObjectID.isValid) 
    console.log('Id is not valid')


User.findById({
    _id: id
}).then((user) => {
    if (!user)
        return console.log(`${id} not found`)
    console.log('User By Id', JSON.stringify(user, undefined, 2));
}).catch(err => console.log(err));