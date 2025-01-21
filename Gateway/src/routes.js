const express = require('express');
const controller = require('./controller');
const router = express.Router();

router
.route('/state')
.get(controller.getState)
.put(controller.putState)
;


module.exports = router;