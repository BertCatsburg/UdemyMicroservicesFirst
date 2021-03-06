const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
// const JSONdb = require('simple-json-db');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};
// const db = new JSONdb(process.env.DATA);

app.get('/posts/:id/comments', (req, res) => {
    console.log('Received request for comments on ', req.params.id);
    // res.send(db.get(req.params.id) || []);
    res.send(commentsByPostId[req.params.id] || []);
});

app.get('/comments', (req, res) => {
    console.log('Requesting all Comments');
    // res.send(db.JSON());
    res.send(commentsByPostId);
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;

    // const comments = db.get(req.params.id) || [];
    const comments = commentsByPostId[req.params.id] || [];

    comments.push({id: commentId, content, status: 'pending'});

    axios.post('http://eventsbus-srv:4005/events', {
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
            console.log(error.message);
        })

    // db.set([req.params.id], comments);
    commentsByPostId[req.params.id] = comments;

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {

    const {type, data} = req.body;

    if (type === 'CommentModerated') {
        console.log('Event Received (processing) : ',req.body);
        const {postId, id, status, content} = data;
        // const comments = db.get(postId);
        const comments = commentsByPostId[postId];

        console.log('comments',comments);

        // const newComments = comments.map((c) => {
        //     if (c.id === id) {
        //         return {
        //             id,
        //             content,
        //             status
        //         }
        //     } else {
        //         return c
        //     }
        // })
        // db.set(postId, newComments);

        const comment = comments.find((comment) => {
            return comment.id === id;
        });
        comment.status = status;

        axios.post('http://eventbus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        })
            .catch((error) =>{
            console.log(error.message);
        });
    } else {
        console.log('Event Received (ignore) : ' + req.body.type);

    }

    res.status(200).send('OK');
})

app.listen(4001, () => {
    console.log('Listening on 4001 for Comments');
});
