const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.route('/state').get((req, res) => {
    console.log('Received state request');
    controller.getState(req, res);
    
});

module.exports = router;