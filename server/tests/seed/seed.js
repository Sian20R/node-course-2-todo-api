const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const dummyUsers = [
    {
        _id: userOneId,
        email: 'seawkerboon@example.com',
        password: 'password123!',
        tokens: 
        [
            {
                access: 'auth',
                token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'sumheimun@example.com',
        password: 'password321!',
        tokens: 
        [
            {
                access: 'auth',
                token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
            }
        ]
    }
];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(dummyUsers[0]).save();
        var userTwo = new User(dummyUsers[1]).save();

        Promise.all([userOne, userTwo]).then(() => done());  // Take in the array of promise, wait until all the promises is completed

    });
};

const dummyTodos = [
    {
        _id: new ObjectID(),
        text: 'First test todo'
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo'
    },
    {
        _id: new ObjectID(),
        text: 'Third test todo'
    }
]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
      return Todo.insertMany(dummyTodos);
    }).then(() => done());
};


module.exports = {
      dummyTodos, 
      populateTodos,
      dummyUsers,
      populateUsers
};