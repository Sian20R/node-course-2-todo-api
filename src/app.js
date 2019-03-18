
const express = require('express');
require('./db/mongoose')
const app = express();

let todoController = require('./controllers/todoController');
let userController = require('./controllers/userController');

// Middleware
app.use(express.json());

// Routes
app.use('/todos', todoController);
app.use('/user', userController);

module.exports = app;
