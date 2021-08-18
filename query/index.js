const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const JSONdb = require('simple-json-db');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = new JSONdb('../data/query.json');
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
    }

    if (type === 'CommentCreated') {
        const { id, content, postId} = data;
        const post = db.get(postId);
        console.log('CommentCreated:post', post);
        post.comments.push({id, content});
        db.set(postId, post);
    }

    res.send({});
});

app.listen(4002, () => {
    console.log('Listening on 4002 for Query');
});






