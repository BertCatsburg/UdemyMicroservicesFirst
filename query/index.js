const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const JSONdb = require('simple-json-db');
const helper = require('./lib/index');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = new JSONdb('../data/queryService.json');
/*
    Data Model:
        posts === {
            'fj302fw4': {
                id: 'fj302fw4',
                title: 'abc',
                comments: [
                    {
                        id: 'sldkfj34',
                        content: 'Commentaar...'
                    }
                ]
        }
 */

app.get('/posts', (req, res) => {
    console.log('Received Request for all Posts');
    res.send(db.JSON());
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
    handleEvents(db, type, data);
    res.send({});
});

app.listen(4002, async () => {
    try {
        console.log('Listening on 4002 for Query');

        const res = await axios.get('http://localhost:4005/events');
        console.log(res.data);
        for (const eventId in res.data) {
            console.log(eventId, res.data[eventId]);
        }
    } catch (error) {
        console.error(error.message);
    }
});






