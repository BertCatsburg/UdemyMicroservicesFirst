const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/events', async (req, res) => {
    console.log('Event: ', req.body);
    const event = req.body;

     axios.post('http://localhost:4000/events', event)
         .catch((error) => {
             console.log('ERROR on Sending Event to POSTS');
             console.log(error.message);
         }); // Posts
     axios.post('http://localhost:4001/events', event)
         .catch((error) => {
             console.log('ERROR on Sending Event to COMMENTS');
             console.log(error.message);
         }); // Comments
    // await axios.post('http://localhost:4002/events', event); // Query Service

    res.send({status: 'OK'});
});

app.listen(4005, () => {
    console.log('Listening on 4005');
});