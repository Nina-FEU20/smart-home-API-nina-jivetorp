const e = require('express');
const { app } = require('./core');
const { update, db } = require('./db');

app.listen(3000, () => {
    console.log('API for smart home 1.1 up n running.')
})

/* CODE YOUR API HERE */

// URL's will be for all in the format of 
// localhost:3000/{category}/{id}/{on/off}
// Only using the numbers for the id in the url. 

// Vacuum Cleaner
// url to turn on = localhost3000/vacuum/1/on 
app.get('/vacuum/:id/:state', (req, res) => {

    // putting together the number enterd in the url with the letters of the id
    let id = "VAC" + req.params.id

    // getting the light that matches the ID. 
    let currentDevice = db.get('devices').value().find(current => current.id === id)

    // if the id doesnt match any of the items, send a message that it doesnt exist.
    if (currentDevice === undefined) {
        res.send("There is no vacuum with this ID")
    } else {

        // function to decide wheter or not state should be true or false, and then using this variabel to set on to true or false in assign. 
        let state = getState(req.params.state, currentDevice)

        // assigning the new state on on 
        db.get('devices')
            .find({ id: id })
            .assign({ on: state })
            .value();

        // ternary operator to check what message to send out.
        // If user has not specified if they want to turn the device on or off, a message that says you have to appears
        req.params.state === "on" || req.params.state === "off" ? res.send(`Vacuum cleaner is ${req.params.state}`) : res.send(`Please specify if you want to turn the vacuum cleaner on or off`)

        // sending the update to frontend
        update();
    }
})


// AC
// url to turn it on = localhost:3000/ac/1/on
// To set the temperature use query ?temperature={number}
app.get('/ac/:id/:state', (req, res) => {

    let id = "AC" + req.params.id
    let currentDevice = db.get('devices').value().find(current => current.id === id)

    if (currentDevice === undefined) {
        res.send("There is no AC with this ID")
    } else {

        let state = getState(req.params.state, currentDevice)


        // in assign. Checking if the temperature added as a query is a number, if its not, or if the user havent specified a temperature
        // the AC will use the previous setting for temperature
        db.get('devices')
            .find({ id: id })
            .assign({ on: state, temperature: isNaN(req.query.temperature) ? currentDevice.temperature : req.query.temperature })
            .value();

        req.params.state === "on" || req.params.state === "off" ? res.send(`AC is ${req.params.state}`) : res.send(`Please specify if you want to turn the AC on or off`)

        update();

    }
})

// Blind
// url to turn it on = localhost:3000/blind/1/on
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

// lights
// url to turn first light on = localhost:3000/ac/1/on
// url to turn second on = localhost:3000/ac/2/on
// url to turn third on = localhost:3000/ac/3/on
// to change the brightness, use query ?brightness={number}
app.get('/light/:id/:state', (req, res) => {

    let id = "LIG" + req.params.id;
    let currentDevice = db.get('devices').value().find(current => current.id === id)

    if (currentDevice === undefined) {
        res.send("There is no light with this ID")
    } else {
        let state = getState(req.params.state, currentDevice)

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
// url to turn on = localhost:3000/camera/1/on
app.get('/camera/:id/:state', (req, res) => {

    let id = "CAM" + req.params.id;
    let currentDevice = db.get('devices').value().find(current => current.id === id)

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
// url to open = localhost:3000/lock/1/on
app.get('/lock/:id/:state', (req, res) => {

    let id = "LOC" + req.params.id;
    let currentDevice = db.get('devices').value().find(current => current.id === id)

    if (currentDevice === undefined) {
        res.send("There is no lock with this ID")
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
// url to turn on = localhost:3000/speaker/1/on
app.get('/speaker/:id/:state', (req, res) => {

    // getting the ID 
    let id = "SPE" + req.params.id;

    // getting the light that matches the ID. 
    let currentDevice = db.get('devices').value().find(current => current.id === id)

    // if the id doesnt match any of the items
    if (currentDevice === undefined) {
        res.send("There is no speaker with this ID")
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


// function to check if we want to turn on or off an item, using this in every get
const getState = (value, item) => {

    if (value === "on") {
        return true;
    } else if (value === "off") {
        return false;
    } else {
        // return the previous value of the item, so if its on, it stays on and vice versa
        return item.on
    }
}

