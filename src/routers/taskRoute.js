
const express = require('express');
const Task = require('./../models/task');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const {ObjectID} = require('mongodb');

// Task routes
router.post('/', authenticate, async (req, res) => {
    try {
        // Creating the new model with values from user
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })

        // Saving the taks into db
        await task.save();
        res.status(201).send(task);
    } catch (err){
        res.status(400).send(err);
    }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/', authenticate, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) 
        match.completed = req.query.completed === 'true';

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
});

router.get('/:id', authenticate, async (req, res) => {
    const _id = req.params.id
    console.log(req.user._id);

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task)
            return res.status(404).send()

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    try {
        var id = req.params.id;

        if (!ObjectID.isValid(id)) 
            return res.status(404).send();

        let task = await Task.findOneAndRemove({_id: id, _creator: req.user._id});
        if (!task)
            return res.status(404).send();

        res.status(200).send(task);
    } catch (e) {
        res.status(400).send();
    }
});

router.patch('/:id', authenticate, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
});


module.exports = router;
