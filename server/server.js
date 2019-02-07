const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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
                return res.status(404).send();

            res.status(200).send({todo});
        }).catch(err => {
            res.status(400).send();
        });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) 
        return res.status(404).send();

        Todo.findByIdAndRemove(id).then((todo) => {
            if (!todo)
                return res.status(404).send();

            res.status(200).send({todo});
        }).catch(err => {
            res.status(400).send();
        });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); // pick function only take in values from the attributes mention

    if (!ObjectID.isValid(id)) 
        return res.status(404).send();

    // Check whether completed is boolean
    if (_.isBoolean(body.completed) && body.completed)
    {
        body.completedAt = new Date().getTime();
    }
    else
    {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {returnNewDocument: true}).then((todo) => {
        if (!todo)
            return res.status(404).send();

        res.status(200).send({todo});
    }).catch(err => {
        res.status(400).send();
    });
});



app.listen(port, () => {
    console.log(`Started on port ${port}`);
})


module.exports = {
    app
}
