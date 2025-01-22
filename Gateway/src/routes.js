const express = require('express');
const controller = require('./controller');
const router = express.Router();

router
.route('/state')
.get(controller.getState)
.put(controller.putState)
;

router
.route('/request')
.get(controller.getRequest)
;

module.exports = router;