const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;

let db;

MongoClient.connect('mongodb+srv://dbAdmin:password2468@coursework2.0xwya.mongodb.net/webstore?retryWrites=true&w=majority', (err, client) => {
    db = client.db('webstore')
});

app.use(express.json());

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
});

app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/messages')
});

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next (e)
        res.send(results)
    })
})

app.listen(3000, ()=> {
    console.log('Running successfully on 3000')
});