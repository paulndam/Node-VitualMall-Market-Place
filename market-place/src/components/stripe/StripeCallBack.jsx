import React, { useEffect } from "react";
import auth from "../../auth/AuthHelper";
import { getAccountStatus } from "../../api/Api-User";

const StripeCallBack = ({ history }, props) => {
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    if (jwt && jwt.token) {
      accountStatus();
    }
  }, [jwt.token, jwt]);

  const accountStatus = async () => {
    try {
      const res = await getAccountStatus({ t: jwt.token });
      console.log(
        "----- user account status on stripe callback response ------->",
        res
      );
      window.location.href = "/seller/stripe/connect";
    } catch (error) {
      console.log(`-- error sending req to get stripe account status ---`);
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Stripe call back. you will be redirected</h1>
    </div>
  );
};

export default StripeCallBack;
