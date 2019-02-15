const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {mongoose} = require('./../db/mongoose');
const {authenticate} = require('./../middleware/authenticate');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../models/todo');

// Todo routes
router.post('/', authenticate, async (req, res) => {
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

router.get('/', authenticate, async (req, res) => {
    try {
        let todos = await Todo.find({_creator: req.user._id});
        res.send({todos})
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:id', authenticate, async (req, res) => {
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

router.delete('/:id', authenticate, async (req, res) => {
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

router.patch('/:id', authenticate, async (req, res) => {
    try {
        let id = req.params.id;
        let body = _.pick(req.body, ['text', 'completed']); // pick function only take in values from the attributes mention
    
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


module.exports = router;
