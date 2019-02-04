// Mongo client let you connect to Mongo server
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err)
        return console.log('Unable to connect to MongoDb')
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp');

    // Find One and Update
    // db.collection('Todos').findOneAndUpdate(
    // {
    //     _id: new ObjectID('5c57a8bc67983749ecbc5767'),
    // },
    // {
    //     $set: {
    //         completed: true
    //     }
    // },
    // {
    //     returnNewDocument: true
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate(
        {
            _id: new ObjectID('5c57a3e867983749ecbc5683'),
        },
        {
            $set: {
                name: 'Sum Hew Mun'
            },
            $inc: {
                age: 2
            }
        },
        {
            returnNewDocument: true
        }).then((result) => {
            console.log(result);
        });

    //client.close();
}); 