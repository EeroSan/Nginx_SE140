const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.route('/').get((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    console.log("endpoint / hit")
    controller.getResponse(req, res, next);
    res.on('finish', () => {
        console.log('Response sent successfully');
        const sleepSeconds = process.env.SLEEPSECONDS || 2;
        controller.sleepFor(sleepSeconds);
    });
});

router.route('/shutdown').get((req, res) => {
    console.log('Received shutdown request');
    controller.shutdown(req, res);
    
});

module.exports = router;