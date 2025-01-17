const express = require('express');
const app = express();

app.get('/state', (req, res) => {
    res.status(200).send('Current state');
});

module.exports = app;