const express = require("express");
const UserController = require("../controller/userController");
const AuthController = require("../controller/authController");
const StripeController = require("../controller/stripeController");

const router = express.Router();

router
  .route("/api/users/")
  .get(UserController.list)
  .post(UserController.create);

router
  .route("/api/users/photo/:userId")
  .get(UserController.photo, UserController.defaultPhoto);
router.route("/api/users/defaultphoto").get(UserController.defaultPhoto);

router
  .route("/api/users/:userId")
  .get(AuthController.requireSignin, UserController.read)
  .put(
    AuthController.requireSignin,
    AuthController.hasAuthorization,
    UserController.update
  )
  .delete(
    AuthController.requireSignin,
    AuthController.hasAuthorization,
    UserController.remove
  );

router
  .route("/api/stripe_auth/:userId")
  .put(
    AuthController.requireSignin,
    AuthController.hasAuthorization,
    UserController.stripeAuth,
    UserController.update
  );

// router.route("/api/stripe_auth").post(
//   AuthController.requireSignin,
//   // AuthController.hasAuthorization,
//   StripeController.createStripeAccount
// );

// router
//   .route("/api/get-account-status")
//   .post(AuthController.requireSignin, StripeController.getAccountStatus);

// // with user controller for stripe

router.param("userId", UserController.userByID);

module.exports = router;
