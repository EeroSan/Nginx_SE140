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

module.exports = router;
