require('./config/config');

const port = process.env.PORT;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let todoController = require('./controllers/todoController');
let userController = require('./controllers/userController');

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/todos', todoController);
app.use('/user', userController);


app.listen(port, () => {
    console.log(`Started on port ${port}`);
})


module.exports = {
    app
}
