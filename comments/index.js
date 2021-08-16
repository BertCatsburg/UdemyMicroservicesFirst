const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const JSONdb = require('simple-json-db');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors);

const db = new JSONdb('./comments.json');

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(db.get(req.params.id) || []);
});

app.get('/comments', (req, res) => {
    res.send(db.JSON());
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = db.get[req.params.id] || [];

    comments.push({ id: commentId, content });

    db.set([req.params.id], comments);

    res.status(201).send(comments);
});

app.listen(4001, () => {
    console.log('Listening on 4001');
});
