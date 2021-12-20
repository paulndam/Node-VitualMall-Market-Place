const express = require("express");
const AuthController = require("../controller/authController");
const ShopController = require("../controller/shopController");
const ProductController = require("../controller/productController");
const UserController = require("../controller/userController");
const OrderController = require("../controller/orderController");

const router = express.Router();

router
  .route("/api/orders/:userId")
  .post(
    AuthController.requireSignin,
    UserController.stripeCustomer,
    ProductController.decreaseQuantity,
    OrderController.create
  );

router
  .route("/api/orders/shop/:shopId")
  .get(
    AuthController.requireSignin,
    ShopController.isOwner,
    OrderController.listByShop
  );

router
  .route("/api/orders/user/:userId")
  .get(AuthController.requireSignin, OrderController.listByUser);

router.route("/api/order/status_values").get(OrderController.getStatusValues);

router
  .route("/api/order/:shopId/cancel/:productId")
  .put(
    AuthController.requireSignin,
    ShopController.isOwner,
    ProductController.increaseQuantity,
    OrderController.update
  );

router
  .route("/api/order/:orderId/charge/:userId/:shopId")
  .put(
    AuthController.requireSignin,
    ShopController.isOwner,
    UserController.createCharge,
    OrderController.update
  );

router
  .route("/api/order/status/:shopId")
  .put(
    AuthController.requireSignin,
    ShopController.isOwner,
    OrderController.update
  );

router.route("/api/order/:orderId").get(OrderController.read);

router.param("userId", UserController.userByID);
router.param("shopId", ShopController.shopByID);
router.param("productId", ProductController.productByID);
router.param("orderId", OrderController.orderByID);

module.exports = router;
