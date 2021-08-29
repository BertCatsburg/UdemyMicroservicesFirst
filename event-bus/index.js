const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
// const JSONdb = require('simple-json-db');
const {randomBytes} = require('crypto');



const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    console.log('Received a Request on EVENT-BUS MicroService');
    console.log(`Method=${req.method} and URL: ${req.url}`);
    if (req.method === "POST") {
        console.log(`Event is ${req.body}`);
    }
    next();
})

// const db = new JSONdb(process.env.DATA);
const events = [];


app.post('/events', async (req, res) => {
    console.log('Incoming Event: ', req.body);
    const event = req.body;

    // ! Store the incoming Event
    // const eventId = randomBytes(4).toString('hex');
    // db.set(eventId, event);
    events.push(event);


    // ! Send out Events to All Services
    axios.post('http://posts-clusterip-srv:4000/events', event)
        .catch((error) => {
            console.log('ERROR on Sending Event to POSTS');
            console.log(error.message);
        }); // Posts
    axios.post('http://comments-srv:4001/events', event)
        .catch((error) => {
            console.log('ERROR on Sending Event to COMMENTS');
            console.log(error.message);
        }); // Comments
    axios.post('http://query-srv:4002/events', event)
        .catch((error) => {
            console.log('ERROR on Sending Event to QUERY Service');
            console.log(error.message);
        }); // Query
    axios.post('http://moderation-srv:4003/events', event)
        .catch((error) => {
            console.log('ERROR on Sending Event to MODERATION Service');
            console.log(error.message);
        }); // Moderation

    res.send({status: 'OK'});
});

app.get('/events', (req, res) => {
    res.send(db.JSON());
    res.send(events);
});

app.listen(4005, () => {
    console.log('Listening on 4005 for the Event Bus');
});
