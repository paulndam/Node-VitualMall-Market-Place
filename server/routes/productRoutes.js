const express = require("express");
const AuthController = require("../controller/authController");
const ShopController = require("../controller/shopController");
const ProductController = require("../controller/productController");

const router = express.Router();

router
  .route("/api/products/by/:shopId")
  .post(
    AuthController.requireSignin,
    ShopController.isOwner,
    ProductController.create
  )
  .get(ProductController.listByShop);

router.route("/api/products/latest").get(ProductController.listLatest);

router
  .route("/api/products/related/:productId")
  .get(ProductController.listRelated);

router.route("/api/products/categories").get(ProductController.listCategories);

router.route("/api/products").get(ProductController.list);

router.route("/api/products/:productId").get(ProductController.read);

router
  .route("/api/product/image/:productId")
  .get(ProductController.photo, ProductController.defaultPhoto);
router.route("/api/product/defaultphoto").get(ProductController.defaultPhoto);

router
  .route("/api/product/:shopId/:productId")
  .put(
    AuthController.requireSignin,
    ShopController.isOwner,
    ProductController.update
  )
  .delete(
    AuthController.requireSignin,
    ShopController.isOwner,
    ProductController.remove
  );

router.param("shopId", ShopController.shopByID);
router.param("productId", ProductController.productByID);

module.exports = router;
