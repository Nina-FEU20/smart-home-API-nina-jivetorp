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
app.get('/vacuum/:id/state', (req, res) => {

    let state = req.params.state === "on" ? true : false
    console.log(state)

    db.get('devices')
        .find({ id: "VAC1" })
        .assign({ on: state })
        .value();


    state === true ? res.send("Vacuum cleaner is on") : res.send("Vacuum cleaner is off")

    update();
})

// AC
app.get('/ac/:id/:state', (req, res) => {

    let state = req.params.state === "on" ? true : false

    db.get('devices')
        .find({ id: "AC1" })
        .assign({ on: state })
        .value();

    state === true ? res.send("AC is on") : res.send("AC is off")

    update();
})

// // Blind

app.get('/blind/:id/:state', (req, res) => {

    let state = req.params.state === "on" ? true : false

    db.get('devices')
        .find({ id: "BLI1" })
        .assign({ on: state })
        .value();

    state === true ? res.send("Blind is down") : res.send("Blind is up")

    update();
})

// lampor
app.get('/lights/:id/:state', (req, res) => {

    // getting the ID 
    let id = "LIG" + req.params.id;

    // getting the light that matches the ID. 
    let currentLight = db.get('devices').value().find(current => current.id === id)

    // if the id doesnt match any of the items
    if (currentLight === undefined) {
        res.send("There is no light with this ID")
    } else {

        let state = "";

        // Checking the value of the param state to decide what to do witht he light
        if (req.params.state === "on") {
            state = true;
        } else if (req.params.state === "off") {
            state = false;
        } else {
            state = currentLight.on
        }

        // sending in the new values we actually want to update with
        db.get('devices')
            .find({ id: id })
            .assign({ on: state, brightness: isNaN((req.query.brightness)) ? currentLight.brightness : req.query.brightness })
            .value();

        // Checking the value of the param state to see what message we wanna send 
        if (req.params.state === "on") {
            res.send(`You turned on the light in the ${currentLight.name}`)
        } else if (req.params.state === "off") {
            res.send(`You turned off the light in the ${currentLight.name}`)
        } else {
            res.send(`The light in the ${currentLight.name} remains the same. Please specify if you want to turn it on or off`)
        }

        update();

    }
})

// Camera
app.get('/camera/:id/:state', (req, res) => {

    let state = req.params.state === "on" ? true : false

    db.get('devices')
        .find({ id: "CAM1" })
        .assign({ on: state })
        .value();

    state === true ? res.send("Camera is on") : res.send("Camera is off")

    update();
})

// lock
app.get('/door/:id/:state', (req, res) => {

    let state = req.params.state === "on" ? true : false

    db.get('devices')
        .find({ id: "LOC1" })
        .assign({ locked: state })
        .value();

    state === true ? res.send("Door is open") : res.send("Door is locked")

    update();
})

// Speaker 
app.get('/speaker/:id/:state', (req, res) => {

    let state = req.params.state === "on" ? true : false

    db.get('devices')
        .find({ id: "SPE1" })
        .assign({ on: state })
        .value();

    state === true ? res.send("Speakers is on!") : res.send("Speaker is off!")

    update();
})


