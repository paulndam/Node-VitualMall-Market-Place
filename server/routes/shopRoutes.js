const express = require("express");
const AuthController = require("../controller/authController");
const ShopController = require("../controller/shopController");
const UserController = require("../controller/userController");

const router = express.Router();

router.route("/api/shops").get(ShopController.list);

router.route("/api/shop/:shopId").get(ShopController.read);

router
  .route("/api/shops/by/:userId")
  .post(
    AuthController.requireSignin,
    AuthController.hasAuthorization,
    UserController.isSeller,
    ShopController.create
  )
  .get(
    AuthController.requireSignin,
    AuthController.hasAuthorization,
    ShopController.listByOwner
  );

router
  .route("/api/shops/:shopId")
  .put(
    AuthController.requireSignin,
    ShopController.isOwner,
    ShopController.update
  )
  .delete(
    AuthController.requireSignin,
    ShopController.isOwner,
    ShopController.remove
  );

router
  .route("/api/shops/logo/:shopId")
  .get(ShopController.photo, ShopController.defaultPhoto);

router.route("/api/shops/defaultphoto").get(ShopController.defaultPhoto);

router.param("shopId", ShopController.shopByID);
router.param("userId", UserController.userByID);

module.exports = router;
