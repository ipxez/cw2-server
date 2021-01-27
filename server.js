const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const port =process.env.PORT || 3000

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
});

const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({_id: new ObjectID(req.params.id) }, (e, result) => {
        if (e) return next (e)
        res.send(result)
    })
});

app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next (e)
        res.send(results.ops)
    })
});

app.delete('collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
        {_id: ObjectID(req.params.id)},
        (e, result) => {
            if (e) return next (e)
            res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
        }
    )
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.listen(port, ()=> {
    console.log('Running successfully on 3000')
});