const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
const dotenv = require("dotenv").config();

const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(401).json({
        error: `Can't find user with that email. Please sign-up`,
      });
    }
    // authenticate method is coming from the user model
    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({
        error: `Email or Password don't match`,
      });
    }

    // create token .
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWTSECRET
    );

    // store toekn in cookie.
    res.cookie("t", token, {
      expire: new Date() + 9999,
    });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        seller: user.seller,
      },
    });
  } catch (err) {
    return res.status(401).json({
      error: `User can't login/sigin into account`,
    });
  }
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "user signed out",
  });
};

const requireSignin = expressJWT({
  secret: process.env.JWTSECRET,
  userProperty: "auth",
  algorithms: ["sha1", "RS256", "HS256"],
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!authorized) {
    return res.status(403).json({
      error: `User is not Authorized`,
    });
  }

  next();
};

module.exports = { signin, signout, requireSignin, hasAuthorization };
