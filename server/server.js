var mongoose = require('mongoose');

// Tell mongoose which Promise library to use
mongoose.Promise = global.Promise;
// Connect to DB with mongoose
mongoose.connect('mongodb://localhost:27017/TodoApp');

// Todo model
var Todo = mongoose.model('Todo', new mongoose.Schema({
        text: String,
        completed: Boolean,
        completedAt: Number
    })
);

// Creating a new todo document
// var newTodo = new Todo({
//     text: 'Cook Dinner'
// });
var newTodo = new Todo({
    text: 'Kicking Football',
    completed: true,
    completedAt: 1549253501076
});

// Saving the todo document into the collection
newTodo.save().then((doc) => {
    console.log('Saved todo', JSON.stringify(doc, undefined, 2));
}, (err) => {
    console.log('Unable to save the todo', err);
});