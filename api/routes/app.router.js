var express = require('express');
var userCtl = require('../controllers/user.controller');
var counterCtl = require('../controllers/counter.controller');
var helpers = require ('../helpers');

const router = new express.Router();

//Authentication
router.route("/registerUser").post(userCtl.registerUser);
router.route("/loginUser").post(userCtl.loginUser);

//Counter
router.route("/current").get(helpers.authCheck,counterCtl.getCurrentCounter);
router.route("/next").get(helpers.authCheck,counterCtl.getNextCounter);
router.route("/current").put(helpers.authCheck,counterCtl.updateCounter);

module.exports = router;
