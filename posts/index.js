const express = require('express');
const {randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const path = require('path');
const JSONdb = require('simple-json-db');

const app = express();
app.use(bodyParser.json());

const db = new JSONdb('./posts.json');

app.get('/posts', async (req, res) => {
    res.send(db.JSON());
});

app.post('/posts', async (req, res) => {

    const id = randomBytes(4).toString('hex');
    const {title} = req.body;
    db.set(id, {id, title});


    res.status(201).send({id, title});
});

app.listen(4000, () => {
    console.log('Listening on 4000');
});
