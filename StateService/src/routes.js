const express = require("express");
const router = express.Router();
const controller = require('./controller');

// Login state routes
router.route('/login')
.post(controller.postLogin)
.get(controller.getLogin);

router.route('/logout')
.post(controller.postLogout)
.get( controller.postLogout);

// System state routes
router.route('/system-state')
.put(controller.putSystemState)
.get( controller.getSystemState);

router.route('/shutdown').get((req, res) => {
    console.log('Received shutdown request');
    controller.shutdown(req, res);
    
});

module.exports = router;
