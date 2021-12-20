const express = require("express");
const AuthController = require("../controller/authController");

const router = express.Router();

router.route("/auth/signin").post(AuthController.signin);

router.route("/auth/signout").get(AuthController.signout);

module.exports = router;
