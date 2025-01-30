const express = require('express');
const controller = require('./controller');
const router = express.Router();

router
.route('/state')
.get(controller.getState)
.put(controller.putState)
;

router
.route('/loginstatus')
.get(controller.getLoginStatus);

router
.route('/request')
.get(controller.getRequest)
;

router
.route("/run-log")
.get(controller.getRunLog)
;

module.exports = router;