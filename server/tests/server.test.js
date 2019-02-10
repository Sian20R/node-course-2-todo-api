const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server/');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');
const {dummyTodos, populateTodos, dummyUsers, populateUsers} = require('./seed/seed');


// Run before running all the other test case
beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos/:id', () => {
    test('should update the todo', (done) => {
        var hexId = dummyTodos[1]._id.toHexString();
        var text = 'This should be a new text';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect((res) => {
                expect(res.body.todo._id).toEqual(hexId);
            })
            .end((err, res) => {
                if (err) 
                    return done(err);

                // query database using findById
                Todo.findById(hexId)
                    .then((todo) => {
                        expect(todo.text).toEqual(text);
                        expect(todo.completed).toBe(true);
                        expect(typeof todo.completedAt).toBe("number");
                        done();
                    }).catch(err => {
                        return done(err);
                    })
            });          

    });

    test('should clear completedAt when todo is not completed', (done) => {
        var hexId = dummyTodos[1]._id.toHexString();

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: 'abc',
            })
            .expect((res) => {
                expect(res.body.todo._id).toEqual(hexId);
            })
            .end((err, res) => {
                if (err) 
                    return done(err);

                // query database using findById
                Todo.findById(hexId)
                    .then((todo) => {
                        expect(todo.completed).toBe(false);
                        expect(todo.completedAt).toBeFalsy();
                        done();
                    }).catch(err => {
                        return done(err);
                    })
            });
    });
});

describe('DELETE /todos/:id', () => {
    test('it shoud remove a todo', (done) => {
        var hexId = dummyTodos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) 
                    return done(err);

                // query database using findById
                Todo.findById(hexId)
                    .then((todo) => {
                        expect(todo).toBeFalsy();
                        done();
                    }).catch(err => {
                        return done(err);
                    })
            });
    });

    test('it shoud return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}}`)
            .expect(404)
            .end(done);
    });

    test('it shoud return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/123}`)
            .expect(404)
            .end(done);
    });
});


describe('GET /user/me', () => {
    test('should return user if authenticated', (done) => {
        request(app)
            .get('/user/me')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(dummyUsers[0]._id.toHexString());
                expect(res.body.email).toBe(dummyUsers[0].email);
            })
            .end(done);

    });

    test('should return 401 if user is not authenticated', (done) => {
        request(app)
            .get('/user/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /user', () => {
    test('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123mnb!';
    
        request(app)
          .post('/user')
          .send({email, password})
          .expect(200)
          .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
          })
          .end((err) => {
            if (err) {
              return done(err);
            }
    
            User.findOne({email}).then((user) => {
              expect(user).toBeTruthy();
              expect(user.password).not.toBe(password);
              done();
            }).catch((e) => done(e));
          });
      });

    test('should return validation error if request is invalid', (done) => {
        var email = 'abc123';
        var password = '1b!';
    
        request(app)
          .post('/user')
          .send({email, password})
          .expect(400)
          .end(done);
    });

    test('should not create user if email is in use', (done) => {
        var email = 'sumheimun@example.com';
        var password = '123mnb!';
    
        request(app)
          .post('/user')
          .send({email, password})
          .expect(400)
          .end(done);
    });
});

describe('POST /user/login', () => {
    test('should login user and return auth token', (done) => {
      request(app)
        .post('/user/login')
        .send({
          email: dummyUsers[1].email,
          password: dummyUsers[1].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
          if (err) 
            return done(err);

          User.findById(dummyUsers[1]._id).then((user) => {
            expect(user.toObject().tokens[1]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((e) => done(e));
        });
    })

    test('should reject invalid login', (done) => {
        request(app)
          .post('/user/login')
          .send({
            email: dummyUsers[1].email,
            password: 'abc123456e'
          })
          .expect(400)
          .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy();
          })
          .end((err, res) => {
            if (err) 
              return done(err);
  
            User.findById(dummyUsers[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((e) => done(e));
          });
      })
});
