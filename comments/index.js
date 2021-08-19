const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const JSONdb = require('simple-json-db');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = new JSONdb('../data/commentsService.json');

app.get('/posts/:id/comments', (req, res) => {
    res.send(db.get(req.params.id) || []);
});

app.get('/comments', (req, res) => {
    res.send(db.JSON());
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;

    const comments = db.get(req.params.id) || [];
    comments.push({id: commentId, content, status: 'pending'});

    axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            postId: req.params.id,
            content: content,
            status: 'pending'
        }
    })
        .catch((error) => {
            console.log('ERROR on sending Event');
        })

    db.set([req.params.id], comments);

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('Event Received: ' + req.body.type);

    const {type, data} = req.body;

    if (type === 'CommentModerated') {
        const {postId, id, status, content} = data;
        const comments = db.get(postId);
        const comment = comments.find((comment) => { return id === comment.id});
        comment.status = status;
        db.set(postId, comments);

        axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            date: {
                id,
                status,
                postId,
                content
            }
        })
            .catch((error) =>{
            console.log(error.message);
        });
    }

    res.status(200).send('OK');
})

app.listen(4001, () => {
    console.log('Listening on 4001 for Comments');
});
