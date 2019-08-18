// Set up
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');

const app = express();

// Configuration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/users");

app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(cors());

/*app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});*/

// Model
const User = mongoose.model('User', {
    name: String,
    health: Number,
    currency: Number
});
// Get all user
app.get('/api/users', function (req, res) {

    console.log("Listing users items...");

    //use mongoose to get all users in the database
    User.find(function (err, users) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        } else {
            res.json(users); // return all users in JSON format
        }
    });
});

// Create a user 
app.post('/api/users', function (req, res) {

    console.log("Creating user...");

    User.create({
        name: req.body.name,
        health: req.body.health,
        currency: req.body.currency,
        done: false
    }, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.send(user);
        }
    });
});

// Get a User
app.get('/api/users/:id', function (req, res) {
    console.log('get single user')
    User.findOne({
        _id: req.params.id
    }, function (err, user) {
        if (err) {
            console.error("Error fetching user ", err);
        } else {
            res.send(user);
        }
    });
});

// Delete a User
app.delete('/api/users/:id', function (req, res) {
    User.remove({
        _id: req.params.id
    }, function (err, user) {
        if (err) {
            console.error("Error deleting user ", err);
        }
        else {
            res.send({ success: 'User deleted!' })
        }
    });
});
// Update a user Item
app.put('/api/users/:id', function (req, res) {
    const { health, currency } = req.body;
    const user = {}
    if (health) {
        user['health'] = health;
    }
    if (currency) {
        user['currency'] = currency;
    }

    console.log("Updating item - ", req.params.id, user);
    User.findOneAndUpdate({ _id: req.params.id }, {$inc: user}, { new: true }, (err, raw) => {
        if (err) {
            return res.send(err);
        }
        res.send(raw);
    });
});


// making a note here.

// Start app and listen on port 8080  
app.listen(process.env.PORT || 8080, () => console.log("Users server listening on port  - ", (process.env.PORT || 8080)));