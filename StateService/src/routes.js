const express = require("express");
const router = express.Router();
const controller = require('./controller');

// Login state routes
router.post("/login", controller.postLogin);
router.get("/login", controller.getLogin);

// System state routes
router.put("/system-state", controller.putSystemState);
router.get("/system-state", controller.getSystemState);

module.exports = router;
