const Product = require("../model/productModel");
const formidable = require("formidable");
const fs = require("fs");
const extend = require("lodash/extend");
const errorHandler = require("../helpers/dbErrorHandler");
const defaultProfileImg = "";

const create = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        message: "Image could not be uploaded",
      });
    }
    let product = new Product(fields);
    console.log(`---- product ---`);
    // console.log(product);
    product.shop = req.shop;
    if (files.photo) {
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.type;
    }
    try {
      let result = await product.save();
      console.log(`-- product create result ---`);
      // console.log(result);
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const productByID = async (req, res, next, id) => {
  try {
    let product = await Product.findById(id)
      .populate("shop", "_id name")
      .exec();
    // console.log(product);
    if (!product)
      return res.status("404").json({
        error: "Product not found",
      });
    req.product = product;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve product",
    });
  }
};

const photo = (req, res, next) => {
  console.log(`-----product photo data-----`);
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + defaultProfileImg);
};

const read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        message: "Photo could not be uploaded",
      });
    }
    let product = req.product;
    product = extend(product, fields);
    product.updated = Date.now();
    if (files.photo) {
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.type;
    }
    try {
      let result = await product.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const remove = async (req, res) => {
  try {
    let product = req.product;
    let deletedProduct = await product.remove();
    res.json(deletedProduct);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByShop = async (req, res) => {
  try {
    let products = await Product.find({ shop: req.shop._id })
      .populate("shop", "_id name")
      .select("-photo");
    res.json(products);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listLatest = async (req, res) => {
  try {
    let products = await Product.find({})
      .sort("-created")
      .limit(12)
      .populate("shop", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listRelated = async (req, res) => {
  try {
    let products = await Product.find({
      _id: { $ne: req.product },
      category: req.product.category,
    })
      .limit(5)
      .populate("shop", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listCategories = async (req, res) => {
  try {
    let products = await Product.distinct("category", {});
    res.json(products);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  const query = {};
  if (req.query.search)
    query.name = { $regex: req.query.search, $options: "i" };
  if (req.query.category && req.query.category != "All")
    query.category = req.query.category;
  try {
    let products = await Product.find(query)
      .populate("shop", "_id name")
      .select("-photo")
      .exec();
    res.json(products);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const decreaseQuantity = async (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.quantity } },
      },
    };
  });
  try {
    await Product.bulkWrite(bulkOps, {});
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not update product",
    });
  }
};

const increaseQuantity = async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(
      req.product._id,
      { $inc: { quantity: req.body.quantity } },
      { new: true }
    ).exec();
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

module.exports = {
  create,
  productByID,
  photo,
  defaultPhoto,
  read,
  update,
  remove,
  listByShop,
  listLatest,
  listRelated,
  listCategories,
  list,
  decreaseQuantity,
  increaseQuantity,
};
