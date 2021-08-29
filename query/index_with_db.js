const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const JSONdb = require('simple-json-db');
const helper = require('./lib/index');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// const db = new JSONdb(process.env.DATA);
const posts = {};


app.get('/posts', (req, res) => {
    console.log('Received Request for all Posts');
    // res.send(db.JSON());
    res.send(posts);
});

function handleEvents(db, type, data) {
    if (type === 'PostCreated') {
        helper.PostCreated(db, data);
    } else if (type === 'CommentCreated') {
        helper.CommentCreated(db, data);
    } else if (type === 'CommentUpdated') {
        helper.CommentUpdated(db, data);
    } else {
        console.log('Event Received (ignore) : ' + type);
    }
}

app.post('/events', (req, res) => {

    const {type, data} = req.body;
    // handleEvents(db, type, data);
    handleEvents(posts, type, data);
    res.send({});
});

app.listen(4002, async () => {
    try {
        console.log('Listening on 4002 for Query');

        const res = await axios.get('http://eventbus-srv:4005/events');
        for (const eventId in res.data) {
            // console.log(eventId, res.data[eventId]);
            // handleEvents(db, res.data[eventId].type, res.data[eventId].data);
            handleEvents(posts, res.data[eventId].type, res.data[eventId].data);
        }
    } catch (error) {
        console.error(error.message);
    }
});






