import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Elements } from "react-stripe-elements";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import auth from "../../auth/AuthHelper";
import cart from "../cart/cartHelper";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { PlaceOrder } from "../allComponents/AllComponents";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = styled((theme) => ({
  card: {
    margin: "24px 0px",
    padding: "16px 40px 90px 40px",
    backgroundColor: "#80808017",
  },
  title: {
    margin: "24px 16px 8px 0px",
    color: theme.palette.openTitle,
  },
  subheading: {
    color: "rgba(88, 114, 128, 0.87)",
    marginTop: "20px",
  },
  addressField: {
    marginTop: "4px",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "45%",
  },
  streetField: {
    marginTop: "4px",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "93%",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "90%",
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const CheckOut = () => {
  const classes = useStyles();
  const [snackOpen, setSnackOpen] = useState(false);

  const user = auth.isAuthenticated().user;
  const [values, setValues] = useState({
    checkoutDetails: {
      products: cart.getCart(),
      customer_name: user.name,
      customer_email: user.email,
      delivery_address: {
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
      },
    },
    error: "",
  });

  const handleCustomerChange = (name) => (event) => {
    let checkoutDetails = values.checkoutDetails;
    checkoutDetails[name] = event.target.value || undefined;
    setValues({ ...values, checkoutDetails: checkoutDetails });
  };

  const handleAddressChange = (name) => (event) => {
    let checkoutDetails = values.checkoutDetails;
    checkoutDetails.delivery_address[name] = event.target.value || undefined;
    setValues({ ...values, checkoutDetails: checkoutDetails });
  };

  if (values.error) {
    setSnackOpen(true);
  }

  const handleSnackClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid sx={{ mt: 3 }} container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              {"Check Out Now"}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "other.main", color: "black" }}>
            <ShoppingCartCheckoutIcon />
          </Avatar>

          {values.error && (
            <Stack spacing={2} sx={{ width: "100%" }}>
              <Snackbar
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                open={snackOpen}
                autoHideDuration={6000}
                onClose={handleSnackClose}
              >
                <Alert
                  onClose={handleSnackClose}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  {values.error}
                </Alert>
              </Snackbar>
            </Stack>
          )}

          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              value={values.checkoutDetails.customer_name}
              onChange={handleCustomerChange("customer_name")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              placeholder="Email"
              multiline
              id="email"
              label="email"
              value={values.checkoutDetails.customer_email}
              onChange={handleCustomerChange("customer_email")}
            />

            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              {"Delivery Address"}
            </Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              placeholder="street address"
              multiline
              id="street address"
              label="street address"
              value={values.checkoutDetails.delivery_address.street}
              onChange={handleAddressChange("street")}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              placeholder="street address"
              multiline
              id="city"
              label="City"
              value={values.checkoutDetails.delivery_address.city}
              onChange={handleAddressChange("city")}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              placeholder="state"
              multiline
              id="state"
              label="State"
              value={values.checkoutDetails.delivery_address.state}
              onChange={handleAddressChange("state")}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              placeholder="zip code"
              multiline
              id="zipcode"
              label="Zip Code"
              value={values.checkoutDetails.delivery_address.zipcode}
              onChange={handleAddressChange("zipcode")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              placeholder="country"
              multiline
              id="country"
              label="Country"
              value={values.checkoutDetails.delivery_address.country}
              onChange={handleAddressChange("country")}
            />

            <Elements>
              <PlaceOrder checkoutDetails={values.checkoutDetails} />
            </Elements>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default CheckOut;
