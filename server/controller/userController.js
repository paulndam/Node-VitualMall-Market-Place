const User = require("../model/userModel");
const request = require("request");
const stripe = require("stripe");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const extend = require("lodash/extend");
const errorHandler = require("../helpers/dbErrorHandler");
const defaultProfileImg = "";

const myStripe = stripe("INSERT YOUR STRIPE SECRET TEST KEY");

const create = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    console.log(`--- users who just got created ---`);
    console.log(user);
    return res.status(200).json({
      message: `signed up successfully`,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    // console.log(user);

    if (!user) {
      return res.status(400).json({
        error: `User with that ID not found`,
      });
    }
    req.profile = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const read = async (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  return res.json(req.profile);
};

const list = async (req, res) => {
  try {
    let users = await User.find().select(
      "name email updated about educator created"
    );
    console.log(`--- List of all users in DB ---`);
    // console.log(users);
    res.json(users);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: `photo could not be uploaded` });
    }
    let user = req.profile;
    user = extend(user, fields, req.body);
    user.updated = Date.now();
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.filepath);
      console.log(`----user photo data-----`);
      user.photo.contentType = files.photo.type;
    }
    try {
      await user.save();
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deleteUser = await user.remove();
    deleteUser.hashed_password = undefined;
    deleteUser.salt = undefined;

    res.json({
      message: `User delelted`,
      deleteUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isSeller = (req, res, next) => {
  const isSeller = req.profile && req.profile.seller;
  // console.log(`---- is seller ----> ${isSeller}`);

  if (!isSeller) {
    return res.status(403).json({
      error: `User is not a seller`,
    });
  }

  next();
};

const photo = (req, res, next) => {
  console.log(`-----profile photo data-----`);
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + defaultProfileImg);
};

const stripeAuth = (req, res, next) => {
  console.log(`-------- req profile --------`);
  console.log(req.profile);
  // SEND REQUEST TO STRIPE API.
  request(
    {
      url: "https://connect.stripe.com/oauth/token",
      method: "POST",
      json: true,
      body: {
        client_secret: process.env.STRIPE_SECRET_KEY,
        code: req.body.stripe,
        grant_type: "authorization_code",
      },
    },
    (error, response, body) => {
      // console.log(`---------- Response ----------`);
      // console.log(response);
      console.log(`============= STRIPE AUTH BODY =======`);
      console.log(body);
      //update user

      if (body.error) {
        return res.status("400").json({
          error: body.error_description,
        });
      }

      console.log(`******************REQ BODY***********`);
      console.log(req.body);
      req.profile.stripe_seller = body;
      console.log(`============= STRIPE SELLER AUTH BODY =======`);
      console.log(req.profile.stripe_seller);
      next();
    }
  );
};

const stripeCustomer = (req, res, next) => {
  if (req.profile.stripe_customer) {
    // update user to stripe customer.
    myStripe.customers.update(
      req.profile.stripe_customer,
      {
        source: req.body.token,
      },
      (err, customer) => {
        if (err) {
          console.log(`--- error updating user to stripe customer --- ${err}`);
          return res.status(400).json({
            error: `Can't update charge details`,
          });
        }
        req.body.order.paymentId = customer.id;
        next();
      }
    );
  } else {
    //   IF USER IS NOT A STRIPE CUSTOMER YET, THEN WE CREATE AND MAKE HIM ONE.

    myStripe.customers
      .create({
        email: req.profile.email,
        source: req.body.token,
      })
      .then((customer) => {
        console.log(`--- new stripe customer ---`);
        console.log(customer);
        User.updateOne(
          { _id: req.profile._id },
          { $set: { stripe_customer: customer.id } },
          (err, order) => {
            console.log(`---order---`);
            console.log(order);
            if (err) {
              return res.status(400).send({
                error: errorHandler.getErrorMessage(err),
              });
            }
            req.body.order.paymentId = customer._id;
            next();
          }
        );
      });
  }
};

const createCharge = (req, res, next) => {
  if (!req.profile.stripe_seller) {
    return res.status(400).json({
      error: `Please connect your stripe account in order to apply charges`,
    });
  }

  myStripe.tokens
    .create(
      { customer: req.order.paymentId },
      { stripeAccount: req.profile.stripe_seller.stripe_user_id }
    )
    .then((token) => {
      console.log(`---token creation for stripe ----`);
      console.log(token);
      myStripe.charges
        .create(
          {
            amount: req.body.amount * 100, //amount in cents.,
            currency: "usd",
            source: token.id,
          },
          { stripeAccount: req.profile.stripe_seller.stripe_user_id }
        )
        .then((charge) => {
          console.log(`---charges for user-----`);
          console.log(charge);
          next();
        });
    });
};

module.exports = {
  create,
  userByID,
  read,
  list,
  update,
  remove,
  isSeller,
  stripeAuth,
  stripeCustomer,
  createCharge,
  photo,
  defaultPhoto,
};
