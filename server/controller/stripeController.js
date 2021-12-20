const User = require("../model/userModel");
const queryString = require("query-string");
const stripe = require("stripe");
const myStripe = stripe(process.env.STRIPE_SECRET_KEY);

const createStripeAccount = async (req, res) => {
  // get user.
  console.log(`========= stripe create request ========`);
  //   console.log(req);
  const user = await User.findById(req.profile._id);
  console.log(`===== fetching stripe user ====`);
  //   console.log(user);

  // create stripe account if user doesn't have one.
  if (!user.stripe_account_id) {
    const account = await myStripe.accounts.create({
      type: "express",
    });
    console.log(`---- stripe account creation -----------> `);
    console.log(account);

    user.stripe_account_id = account.id;
    console.log(`-------- stripe account user ID ----`);
    console.log(user.stripe_account_id);
    user.save();
  }

  // creating login link based on user account and send to frnt-end.
  // use querystring for that.
  // firt make request to stripe auth.

  let accountLink = await myStripe.accountLinks.create({
    account: user.stripe_account_id,
    refresh_url: "http://localhost:3000/stripe/callback",
    return_url: "http://localhost:3000/stripe/callback",
    type: "account_onboarding",
  });
  // prefil any account info.
  accountLink = Object.assign(accountLink, {
    "stripe_user[email]": user.email || undefined,
  });
  console.log(`----stripe account link -----> `);
  console.log(accountLink);

  const stripeLink = `${accountLink.url}?${queryString.stringify(accountLink)}`;
  console.log(`----------- stripe link ---------->`);
  console.log(stripeLink);

  res.send(stripeLink);
};

const delayPaymentDays = async (accountId) => {
  const account = await myStripe.accounts.update(accountId, {
    settings: {
      payouts: {
        schedule: {
          delay_days: 7,
        },
      },
    },
  });
  return account;
};

const getAccountStatus = async (req, res) => {
  console.log(`-------- Get strip account status --------`);
  // make request to stripe.
  // access current login user by querying DB.
  const user = await User.findById(req.profile._id);
  // get user account from stripe.
  const account = await myStripe.accounts.retrieve(user.stripe_account_id);
  console.log(`----Retrieved stripe user account info `);
  console.log(account);
  // delay payment days for seller.
  const delayUserPayment = await delayPaymentDays(account.id);
  // update user .
  const updateUser = await User.findByIdAndUpdate(
    req.profile._id,
    {
      // stripe seller account.
      stripe_seller: delayUserPayment,
    },
    { new: true }
  )
    .select("-hashed_password")
    .exec();
  console.log(`---- Updated user stripe info -------`);
  console.log(updateUser);
  res.send(updateUser);
};

module.exports = {
  createStripeAccount,
  delayPaymentDays,
  getAccountStatus,
};
