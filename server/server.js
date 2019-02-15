require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {authenticate} = require('./middleware/authenticate');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());


// /todos
app.post('/todos', authenticate, async (req, res) => {
    try {
        // Creating the new model with values from user
        var todo = new Todo({
            text: req.body.text,
            _creator: req.user._id
        });

        // Saving the todo into db
        var doc = await todo.save();
        res.send(doc);
    } catch (err){
        res.status(400).send(err);
    }
});

app.get('/todos', authenticate, async (req, res) => {
    try {
        let todos = await Todo.find({_creator: req.user._id});
        res.send({todos})
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/todos/:id', authenticate, async (req, res) => {
    try {
        var id = req.params.id;

        if (!ObjectID.isValid(id)) 
            return res.status(404).send();

        let todo =  await Todo.findOne({ _id: id, _creator: req.user._id});
        if (!todo)
            return res.status(404).send();
        res.status(200).send({todo});

    } catch (err) {
        res.status(400).send();
    }
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    try {
        var id = req.params.id;

        if (!ObjectID.isValid(id)) 
            return res.status(404).send();

        var todo = await Todo.findOneAndRemove({_id: id, _creator: req.user._id});
        if (!todo)
            return res.status(404).send();
        res.status(200).send({todo});
    } catch (e) {
        res.status(400).send();
    }
});

app.patch('/todos/:id', authenticate, async (req, res) => {
    try {
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

        let todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {returnNewDocument: true});
        if (!todo)
            return res.status(404).send();
        res.status(200).send({todo});
    } catch (err) {
        res.status(400).send();
    }
});

// /user
app.post('/user', async (req, res) => {
     // Saving the users into db
    try {
        var body = _.pick(req.body, ['email', 'password']);
        var user = new User(body);

        await user.save();
        let token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/user/me', authenticate, async (req, res) => {
   await res.send(req.user);
});

app.post('/user/login', async (req, res) => {
    // Authenticate the user login and set the token on x-auth to validate the user is valid
    try {
        var body = _.pick(req.body, ['email', 'password']);

        var user =  await User.findByCredentials(body.email, body.password);
        var token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    } 
});

app.delete('/user/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch(e) {
         res.status(400).send();
    }
});



app.listen(port, () => {
    console.log(`Started on port ${port}`);
})


module.exports = {
    app
}
