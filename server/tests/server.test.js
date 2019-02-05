const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server/');
var {Todo} = require('./../models/todo');

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

// Run before running all the other test case
beforeEach((done) => {
    Todo.remove({}).then(() => {
       Todo.insertMany(dummyTodos);
    }).then(() => done());
});

describe('POST /todo', () => {
    test('should create a new todo', (done) => {
        var text = 'Test todo text';

        // Test case for making post request
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
        .end((err, res) => {
            // Handle error if the status code is not 200 or not the body text expected
            if (err)
                return done(err);
            
            // Check if the todo doc is added into db
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        })
    });

    test('should not create todo with invalid body data', (done) => {
        var text = '';

        // Test case for making post request
        request(app)
            .post('/todos')
            .send({text})
            .expect(400)
        .end((err, res) => {
            // Handle error if the status code is not 400
            if (err)
                return done(err);
            
            // Check if the todo doc is added into db
            Todo.find().then((todos) => {
                expect(todos.length).toBe(3);
                done();
            }).catch((e) => done(e));
        })
    });
});


describe('GET /Todos', () => {
    test('it should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });

    test('it should return the doc', (done) => {
        request(app)
            .get(`/todos/${dummyTodos[0]._id.toString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(dummyTodos[0].text);
            })
            .end(done);
    });

    test('it should return a 404 if todo is not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexId}}`)
            .expect(404)
            .end(done);
    });

    test('it should return a 404 if id is not valid', (done) => {
        request(app)
            .get(`/todos/123}`)
            .expect(404)
            .end(done);
    });
});
