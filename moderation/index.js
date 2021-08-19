const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
// const JSONdb = require('simple-json-db');

const app = express();
app.use(bodyParser.json());

// const db = new JSONdb('../data/moderationService.json');

app.post('/events', async (req, res) => {

    const {type, data} = req.body;

    if (type === 'CommentCreated') {
        // * Start Comment Validation
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status: status,
                content: data.content
            }
        })
        console.log('Event Received (processing) : ',req.body);
    } else {
        console.log('Event Received (ignore) :',req.body.type);
    }

    res.send({});

});

app.listen(4003, () => {
    console.log('Listinging on 4003 for Moderation');
})
