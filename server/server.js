var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

// Middleware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // Creating the new model with values from user
    var todo = new Todo({
        text: req.body.text
    });

    // Saving the todo into db
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) 
        return res.status(404).send();

        Todo.findById({
            _id: id
        }).then((todo) => {
            if (!todo)
                return res.status(404).send(null);

            res.status(200).send({todo});
        }).catch(err => {
            res.status(400).send();
        });
});

app.listen(3000, () => {
    console.log(`Started on port 3000`);
})


module.exports = {
    app
}
