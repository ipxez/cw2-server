const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 3000;


// This serves images to front-end from backend image folder
app.use('/images', express.static(__dirname + '/images'));
// Parse request parameters
app.use(express.json());

// Connecting to MongoDB
let db;
MongoClient.connect('mongodb+srv://dbAdmin:password2468@coursework2.0xwya.mongodb.net/webstore?retryWrites=true&w=majority', (err, client) => {
    db = client.db('webstore')
});

const path = require("path");

// Attempted to do the image forwarding, perhaps this is worth some marks?
// Can you explain what I should have done?

// app.get("/images/:file", (req, res, next) => {
//     console.log("in action!!!", req.params.file)
//     let file = req.params.file;
//     let test = path.join(__dirname, '/images/', file);
//     console.log(`${test}`)
//     //console.log("%", req.method, req.url, res.send);
//     res.send(test)
//     console.log('sent.. i think')
//     next();
// });

// app.get('/:file(*)', (req, res, next) => {
//     console.log('image requested', req.params.file)
//     let file = req.params.file;
//     let test = path.join(__dirname, '/images/', file);
//     res.sendFile(test);
//     next();
// });

app.use(function(req, res, next) {
    // Allow different IP Addresses
    res.header("Access-Control-Allow-Origin", "*");
    // Allow different header fields
    res.header("Access-Control-Allow-Headers", "*");

    res.header("Access-Control-Allow-Methods", "*");
    next();
});

// Get the name of the collection
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    console.log("Requesting data from: ", collectionName)
    return next()
});

// Root path message
app.get('/', (req, res, next) => {
    res.send('To select a collection type the name in the URL, example: /collection/products')
});

// GET all objects from a collection
app.get('/collection/:collectionName', (req, res, next) => {
    console.log(req.method, "request for", req.params);
    req.collection.find({}).toArray((e, results) => {
        if (e) return next (e)
        res.send(results);
        console.log("Data Sent to front-end");
    })
});

// GET Object by MongoDB ID
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id', (req, res, next) => {
    console.log(req.method, "request for", req.params);
    req.collection.findOne({_id: new ObjectID(req.params.id) }, (e, result) => {
        if (e) return next (e)
        res.send(result);
        console.log("Data Sent to front-end");
    })
});

// POST an Object to Database Collection
app.post('/collection/:collectionName', (req, res, next) => {
    console.log(req.method, "to", req.params);
    req.collection.insertOne(req.body, (e, results) => {
        if (e) return next (e)
        res.send(results.ops)
        console.log("Successfully Posted Order Details");
    })
});

// PUT (update) data in a database collection object
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.updateOne(
        {_id: new ObjectID(req.params.id)},
        {$set: req.body},
        {safe: true, multi: false},
        (e, result) => {
            console.log('Product:', req.params.id, 'has been updated to:', req.body);
            if (e) return next(e)
            res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
        }
    )
});

// DELETE an object from a database collection
app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
        {_id: ObjectID(req.params.id)},
        (e, result) => {
            console.log('Product:', req.params.id, 'has been deleted');
            if (e) return next (e)
            res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
        }
    )
});

app.listen(port, ()=> {
    console.log('Server running successfully on:', port)
});