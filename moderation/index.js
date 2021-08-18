const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const JSONdb = require('simple-json-db');

const app = express();
app.use(bodyParser.json());

const db = new JSONdb('../data/moderationService.json');

app.post('/events', (req, res) => {


});

app.listen(4003, () => {
    console.log('Listinging on 4003 for Moderation');
})
