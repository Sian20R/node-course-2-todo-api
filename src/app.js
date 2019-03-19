
const express = require('express');
require('./db/mongoose')
const app = express();

let taskRoute = require('./routers/taskRoute');
let userRoute = require('./routers/userRoute');

// Middleware
app.use(express.json());

// Routes
app.use('/tasks', taskRoute);
app.use('/users', userRoute);

module.exports = app;
