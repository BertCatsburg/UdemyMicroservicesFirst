const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const JSONdb = require('simple-json-db');
const helper = require('./lib/index');

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

app.post('/events', (req, res) => {

    const {type, data} = req.body;

    if (type === 'PostCreated') {
        helper.PostCreated(db, data);
    } else if (type === 'CommentCreated') {
        helper.CommentCreated(db, data);
    } else if (type === 'CommentUpdated') {
        helper.CommentUpdated(db, data);
    } else {
        console.log('Event Received (ignore) : ' + req.body.type);
    }

    res.send({});
});

app.listen(4002, () => {
    console.log('Listening on 4002 for Query');
});






