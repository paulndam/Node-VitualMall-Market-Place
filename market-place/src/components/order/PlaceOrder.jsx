import React, { useState, useEffect } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { create } from "../../api/Api-Order";
import cart from "../cart/cartHelper";
import auth from "../../auth/AuthHelper";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Redirect } from "react-router-dom";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";

const useStyles = styled((theme) => ({
  subheading: {
    color: "rgba(88, 114, 128, 0.87)",
    marginTop: "20px",
  },
  checkout: {
    float: "right",
    margin: "20px 30px",
  },
  error: {
    display: "inline",
    padding: "0px 10px",
  },
  errorIcon: {
    verticalAlign: "middle",
  },
  StripeElement: {
    display: "block",
    margin: "24px 0 10px 10px",
    maxWidth: "408px",
    padding: "10px 14px",
    boxShadow:
      "rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px",
    borderRadius: "4px",
    background: "white",
  },
}));

const PlaceOrder = (props) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    order: {},
    error: "",
    redirect: false,
    orderId: "",
  });

  const placeOrder = () => {
    // generate a card token,upon success the token will be send to backend to create an order
    props.stripe.createToken().then((payload) => {
      console.log(`--- stripe token payload ----`);
      console.log(payload);
      if (payload.error) {
        setValues({ ...values, error: payload.error.message });
      } else {
        const jwt = auth.isAuthenticated();
        create(
          { userId: jwt.user._id },
          { t: jwt.token },
          props.checkoutDetails,
          payload.token.id
        ).then((data) => {
          console.log(`--- create order data ---`);
          console.log(data);
          if (data.error) {
            setValues({ ...values, error: data.error });
          } else {
            cart.emptyCart(() => {
              setValues({ ...values, orderId: data._id, redirect: true });
            });
          }
        });
      }
    });
  };

  if (values.redirect) {
    return <Redirect to={`/order/${values.orderId}`} />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "50vh",
          //   width: 900,
          overflow: "auto",
        }}
      >
        <Toolbar />

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ textAlign: "center", mb: 3 }}
                >
                  {"Card Details"}
                </Typography>
                <CardElement
                  className={classes.StripeElement}
                  {...{
                    style: {
                      base: {
                        color: "#424770",
                        letterSpacing: "0.025em",
                        fontFamily: "Source Code Pro, Menlo, monospace",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />

                {values.error && (
                  <Typography
                    component="span"
                    color="error"
                    className={classes.error}
                  >
                    Error.{""} {values.error}
                  </Typography>
                )}
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={placeOrder}
                  sx={{ mt: 3, mb: 3 }}
                >
                  Place Order
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

PlaceOrder.prototype = {
  checkoutDetails: PropTypes.object.isRequired,
};

export default injectStripe(PlaceOrder);
