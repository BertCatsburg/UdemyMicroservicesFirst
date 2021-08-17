const express = require('express');
const {randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const JSONdb = require('simple-json-db');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = new JSONdb('../data/posts.json');

/**
 * get /posts
 */
app.get('/posts', async (req, res) => {
    res.send(db.JSON());
});

/**
 * post /posts
 */
app.post('/posts', async (req, res) => {
    console.log(`Request with title =[${req.body.title}]`);

    if (req.body.title.length === 0) {
        res.status(200).send({});
        return;
    }

    const id = randomBytes(4).toString('hex');
    const {title} = req.body;
    db.set(id, {id, title});

    axios.post('http://localhost:4005/events', {
            type: 'PostCreated',
            data: {
                id: id,
                title: title
            }
        })
        .catch((error) => {
            console.log('ERROR on sending Event');
        })

    res.status(201).send({id, title});
});

app.post('/events', (req, res) => {
    console.log('Event Received: ' + req.body.type);

    res.status(200).send('OK');
})
/**
 * App-Listen
 */
app.listen(4000, () => {
    console.log('Listening on 4000');
});
