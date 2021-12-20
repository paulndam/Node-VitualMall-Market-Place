import React, { useState, useEffect } from "react";
import { CartItem } from "../allComponents/AllComponents";
import Grid from "@mui/material/Grid";
import { StripeProvider } from "react-stripe-elements";
import { CheckOut } from "../allComponents/AllComponents";

const Cart = () => {
  const [checkout, setCheckout] = useState(false);

  const showCheckOut = (val) => {
    setCheckout(val);
  };
  return (
    <>
      <CartItem checkOut={checkout} setCheckout={showCheckOut} />

      {checkout && (
        <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_KEY2}`}>
          <CheckOut />
        </StripeProvider>
      )}
    </>
  );
};

export default Cart;
