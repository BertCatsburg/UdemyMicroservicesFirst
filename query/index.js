const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const JSONdb = require('simple-json-db');

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
    res.send(db.JSON());
});

app.post('/events', (req, res) => {

    const {type, data} = req.body;

    if (type === 'PostCreated') {
        const {id, title} = data;
        db.set(id, {id, title, comments: []});
        console.log('Event Received (processing) : ',req.body);
    } else if (type === 'CommentCreated') {
        const { id, content, postId, status} = data;
        const post = db.get(postId);
        post.comments.push({id, content, status});
        db.set(postId, post);
        console.log('Event Received (processing) : ',req.body);
    } else if (type === 'CommentUpdated') {
        const { id, content, postId, status} = data;
        const post = db.get(postId);
        console.log('Event Received (processing) : ',req.body);
        const newComments = comments.map((comment) => {
            if (comment.id !== id) {
                return comment;
            } else {
                return {
                    id,
                    content,
                    postId,
                    status
                }
            }
        })
        const newPost = {
            ...post,
            comments: {
                ...newComments,
            }
        }
        db.set(postId, post);
    } else {
        console.log('Event Received (ignore) : ' + req.body.type);
    }

    res.send({});
});

app.listen(4002, () => {
    console.log('Listening on 4002 for Query');
});






