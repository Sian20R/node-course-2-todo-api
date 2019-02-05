const request = require('supertest');

var {app} = require('./../server/');
var {Todo} = require('./../models/todo');

// Run before running all the other test case
beforeEach((done) => {
    Todo.remove({}).then(() => {
       done(); 
    });
});

describe('POST /todos', () => {
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
            Todo.find().then((todos) => {
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
                expect(todos.length).toBe(0);
                done();
            }).catch((e) => done(e));
        })
    });
});
