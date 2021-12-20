const Shop = require("../model/shopModel");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const extend = require("lodash/extend");
const errorHandler = require("../helpers/dbErrorHandler");
const defaultProfileImg = "";

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: "Image or photo could not be uploaded",
      });
    }
    let shop = new Shop(fields);
    console.log(shop);
    shop.owner = req.profile;
    if (files.photo) {
      shop.photo.data = fs.readFileSync(files.photo.filepath);
      shop.photo.contentType = files.photo.type;
    }
    try {
      let result = await shop.save();
      console.log(result);
      res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const shopByID = async (req, res, next, id) => {
  try {
    let shop = await Shop.findById(id).populate("owner", "_id name").exec();
    console.log(`getting shop by ID`);
    console.log(shop);
    if (!shop)
      return res.status("404").json({
        error: "Shop not found",
      });

    req.shop = shop;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve shop",
    });
  }
};

const photo = (req, res, next) => {
  console.log(`-----shop photo data-----`);
  if (req.shop.photo.data) {
    res.set("Content-Type", req.shop.photo.contentType);
    return res.send(req.shop.photo.data);
  }
  next();
};

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + defaultProfileImg);
};

const read = (req, res) => {
  req.shop.photo = undefined;
  return res.json(req.shop);
};

const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: "Photo or image could not be uploaded",
      });
    }
    let shop = req.shop;
    console.log(`--- shop to be updated ---`);
    console.log(shop);
    shop = extend(shop, fields);
    shop.updated = Date.now();
    if (files.photo) {
      shop.photo.data = fs.readFileSync(files.photo.filepath);
      shop.photo.contentType = files.photo.type;
    }
    try {
      let result = await shop.save();
      console.log(`--updated shop results ---`);
      console.log(result);
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
    let shop = req.shop;
    let deletedShop = shop.remove();
    res.json({
      message: `shop deleted`,
      deletedShop,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  try {
    let shops = await Shop.find();
    console.log(`--- list of all shops ----`);
    console.log(shops);
    res.json(shops);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByOwner = async (req, res) => {
  try {
    let shops = await Shop.find({ owner: req.profile._id }).populate(
      "owner",
      "_id name"
    );
    console.log(`---- list of shops owned by the user/owner----`);
    console.log(shops);
    res.json(shops);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isOwner = (req, res, next) => {
  const isOwner = req.shop && req.auth && req.shop.owner._id == req.auth._id;
  console.log(
    `--- owner or user is authenticated and owns shop. shop and owner/user info below ----`
  );
  console.log(isOwner);
  if (!isOwner) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

module.exports = {
  create,
  shopByID,
  photo,
  defaultPhoto,
  read,
  update,
  remove,
  list,
  listByOwner,
  isOwner,
};
