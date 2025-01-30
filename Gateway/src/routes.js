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

router
.route("/shutdown")
.get(controller.shutdownRemaining);

// router.route('/shutdownAll').get((req, res) => {
//     console.log('Received shutdown all request');
//     controller.shutdownAll(req, res);
    
// });

module.exports = router;