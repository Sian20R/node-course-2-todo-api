const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.remove({}).then((result) => {
    console.log(result);
});

// findOneAndRemove
Todo.findOneAndRemove({_id: '5c5bbb7758e4acefd0bd7f2f'}).then(() => {
    console.log(todo);
});

// findByIdAndRemove
Todo.findByIdAndRemove('5c5bbb7758e4acefd0bd7f2f').then((todo) => {
    console.log(todo);
});