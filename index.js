const e = require('express');
const { app } = require('./core');
const { update, db } = require('./db');

app.listen(3000, () => {
    console.log('API for smart home 1.1 up n running.')
})

/* CODE YOUR API HERE */

// all devices
let devices = db.get('devices').value();


// different gets for all devices by category, after that a param for the id, after that querys for on or off
// localhost:3000/{category}/{id}?state={on/off}

// vacuum
app.get('/vacuum/:id/:state', (req, res) => {

    let id = "VAC" + req.params.id

    // getting the light that matches the ID. 
    let currentDevice = db.get('devices').value().find(current => current.id === id)

    // if the id doesnt match any of the items
    if (currentDevice === undefined) {
        res.send("There is no vacuum with this ID")
    } else {

        let state = getState(req.params.state, currentDevice)

        db.get('devices')
            .find({ id: id })
            .assign({ on: state })
            .value();

        req.params.state === "on" || req.params.state === "off" ? res.send(`Vacuum cleaner is ${req.params.state}`) : res.send(`Please specify if you want to turn the vacuum cleaner on or off`)

        update();
    }
})


// AC
app.get('/ac/:id/:state', (req, res) => {

    let id = "AC" + req.params.id
    let currentDevice = db.get('devices').value().find(current => current.id === id)

    if (currentDevice === undefined) {
        res.send("There is no AC with this ID")
    } else {

        let state = getState(req.params.state, currentDevice)

        db.get('devices')
            .find({ id: id })
            .assign({ on: state, temperature: isNaN(req.query.temperature) ? currentDevice.temperature : req.query.temperature })
            .value();

        req.params.state === "on" || req.params.state === "off" ? res.send(`AC is ${req.params.state}`) : res.send(`Please specify if you want to turn the AC on or off`)

        update();

    }
})

// // Blind

app.get('/blind/:id/:state', (req, res) => {

    let id = "BLI" + req.params.id
    let currentDevice = db.get('devices').value().find(current => current.id === id)

    if (currentDevice === undefined) {
        res.send("There is no blind with this ID")
    } else {

        let state = getState(req.params.state, currentDevice)

        db.get('devices')
            .find({ id: id })
            .assign({ on: state })
            .value();

        req.params.state === "on" || req.params.state === "off" ? res.send(`The Blind is ${req.params.state === "on" ? "down" : "up"}`) : res.send(`Please specify if you want to turn the blind on or off`)

        update();
    }
})

// lampor
app.get('/light/:id/:state', (req, res) => {

    // getting the ID 
    let id = "LIG" + req.params.id;

    // getting the light that matches the ID. 
    let currentDevice = db.get('devices').value().find(current => current.id === id)

    // if the id doesnt match any of the items
    if (currentDevice === undefined) {
        res.send("There is no light with this ID")
    } else {
        let state = getState(req.params.state, currentDevice)

        // sending in the new values we actually want to update with
        db.get('devices')
            .find({ id: id })
            .assign({ on: state, brightness: isNaN((req.query.brightness)) ? currentDevice.brightness : req.query.brightness })
            .value();

        // Checking the value of the param state to see what message we wanna send 
        req.params.state === "on" || req.params.state === "off" ? res.send(`You turned ${req.params.state} the light in the ${currentDevice.name}`) : res.send(`Please specify if you want to turn the light on or off`)

        update();
    }
})

// Camera
app.get('/camera/:id/:state', (req, res) => {

    // getting the ID 
    let id = "CAM" + req.params.id;

    // getting the light that matches the ID. 
    let currentDevice = db.get('devices').value().find(current => current.id === id)

    // if the id doesnt match any of the items
    if (currentDevice === undefined) {
        res.send("There is no camera with this ID")
    } else {
        let state = getState(req.params.state, currentDevice)

        db.get('devices')
            .find({ id: id })
            .assign({ on: state })
            .value();

        req.params.state === "on" || req.params.state === "off" ? res.send(`Camera is ${req.params.state}`) : res.send(`Please specify if you want to turn the camera on or off`)

        update();
    }
})

// lock
app.get('/lock/:id/:state', (req, res) => {

    // getting the ID 
    let id = "LOC" + req.params.id;

    // getting the light that matches the ID. 
    let currentDevice = db.get('devices').value().find(current => current.id === id)

    // if the id doesnt match any of the items
    if (currentDevice === undefined) {
        res.send("There is no camera with this ID")
    } else {

        let state = getState(req.params.state, currentDevice)

        db.get('devices')
            .find({ id: id })
            .assign({ locked: state })
            .value();

        req.params.state === "on" || req.params.state === "off" ? res.send(`Door is ${req.params.state === "on" ? "open" : "closed"}`) : res.send(`Please specify if you want to lock or open the door`)

        update();
    }
})

// Speaker 
app.get('/speaker/:id/:state', (req, res) => {

    // getting the ID 
    let id = "SPE" + req.params.id;

    // getting the light that matches the ID. 
    let currentDevice = db.get('devices').value().find(current => current.id === id)

    // if the id doesnt match any of the items
    if (currentDevice === undefined) {
        res.send("There is no camera with this ID")
    } else {

        let state = getState(req.params.state, currentDevice)


        db.get('devices')
            .find({ id: id })
            .assign({ on: state })
            .value();

        req.params.state === "on" || req.params.state === "off" ? res.send(`Speakers is ${req.params.state}`) : res.send(`Please specify if you want to turn the speaker on or off`)

        update();
    }
})


// function to check if we want to turn on or off an item
const getState = (value, item) => {

    if (value === "on") {
        return true;
    } else if (value === "off") {
        return false;
    } else {
        return item.on
    }
}

