// Mongo client let you connect to Mongo server
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err)
        return console.log('Unable to connect to MongoDb')
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp');

    // db.collection ('Todos').find({
    //     _id: new ObjectID('5c57a04267983749ecbc5633')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs));
    // }, (err) => {
    //     console.log('Unable to fetch the docs', err);
    // });

    // db.collection ('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch the docs', err);
    // });

    db.collection ('Users').find({
        name: 'Seaw Ker Boon' 
    }).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs));
    }, (err) => {
        console.log('Unable to fetch the docs', err);
    });

    //client.close();
}); 