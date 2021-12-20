import React, { useState, useEffect } from "react";
import auth from "../../auth/AuthHelper";
import cart from "../cart/cartHelper";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import PropTypes from "prop-types";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import TextField from "@mui/material/TextField";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const CartItem = (props) => {
  const [cartItems, setCartItems] = useState(cart.getCart());

  const handleChange = (i) => (e) => {
    let updatedCartItems = cartItems;
    if (e.target.value === 0) {
      updatedCartItems[i].quantity = 1;
    } else {
      updatedCartItems[i].quantity = e.target.value;
    }
    setCartItems([...updatedCartItems]);
    cart.updateCart(i, e.target.value);
  };

  const getTotal = () => {
    return cartItems.reduce((acc, b) => {
      return acc + b.quantity * b.product.price;
    }, 0);
  };

  const removeItem = (i) => (e) => {
    let updatedCartItems = cart.removeItem(i);
    if (updatedCartItems.length === 0) {
      props.setCheckout(false);
    } else {
      setCartItems(updatedCartItems);
    }
  };

  const openCheckOut = () => {
    props.setCheckout(true);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid item xs={12} md={12} lg={12} sx={{ marginTop: 5, marginBottom: 8 }}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            {"My Shopping Cart"}
          </Typography>
        </Paper>
      </Grid>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item, i) => (
            <Box key={i} sx={{ display: "flex" }}>
              <Box
                key={i}
                component="main"
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  flexGrow: 1,

                  overflow: "auto",
                }}
              >
                <Toolbar />

                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                  <Grid item xs={12} md={8} lg={9}>
                    {/* <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    > */}
                    <Card sx={{ display: "flex" }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: 1400,
                          mr: 1,
                        }}
                      >
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          <Link
                            underline="none"
                            href={`/product/${item.product._id}`}
                            sx={{ color: "black" }}
                          >
                            <Typography component="div" variant="h5">
                              {item.product.name}
                            </Typography>
                          </Link>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                          >
                            Shop : {item.product.shop.name}
                          </Typography>

                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                          >
                            Price : ${item.product.price}
                          </Typography>
                        </CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            pl: 1,
                            pb: 1,
                          }}
                        >
                          {/* <IconButton aria-label="previous">
                              <Typography
                                variant="h6"
                                color="text.secondary"
                                component="div"
                                sx={{ textAlign: "center", color: "green" }}
                              >
                                ${item.product.price}
                              </Typography>
                            </IconButton>
                            {"|"} */}
                          <IconButton aria-label="previous">
                            <Typography
                              variant="h6"
                              color="text.secondary"
                              component="div"
                              sx={{ textAlign: "center", color: "green" }}
                            >
                              Total : $
                              {`${Number(
                                item.product.price * item.quantity
                              ).toFixed(1)}`}
                            </Typography>
                          </IconButton>
                        </Box>
                        <Box sx={{ mb: 3, ml: 2 }}>
                          Quantity :{" "}
                          <TextField
                            id="standard-basic"
                            type="number"
                            label="enter quantity"
                            variant="standard"
                            value={item.quantity}
                            onChange={handleChange(i)}
                            inputProps={{
                              min: 1,
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <Button
                            size="small"
                            sx={{ color: "red" }}
                            onClick={removeItem(i)}
                          >
                            <RemoveCircleIcon /> {"Remove"}
                          </Button>
                        </Box>
                      </Box>
                      <CardMedia
                        component="img"
                        height="194"
                        // sx={{ width: 35 }}
                        image={`${process.env.REACT_APP_API}/api/product/image/${item.product._id}`}
                        alt="edit account to upload image"
                      />
                    </Card>
                    {/* </Paper> */}
                  </Grid>
                </Container>
              </Box>
            </Box>
          ))}

          {/* checkout section */}
          <Box sx={{ flexGrow: 1 }}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      component="div"
                      sx={{ textAlign: "center", color: "green", mb: 3 }}
                    >
                      Total : ${getTotal()}
                    </Typography>
                    {!props.checkOut && auth.isAuthenticated() ? (
                      <Button
                        onClick={openCheckOut}
                        variant="outlined"
                        sx={{ color: "#00b0ff" }}
                      >
                        CheckOut
                      </Button>
                    ) : (
                      <>
                        <Grid
                          container
                          rowSpacing={1}
                          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        >
                          {!auth.isAuthenticated() && (
                            <Grid item xs={6}>
                              <Link underline="none" href={`/signin`}>
                                <Button
                                  color="warning"
                                  size="small"
                                  variant="contained"
                                >
                                  sign-in to checkout
                                </Button>
                              </Link>
                            </Grid>
                          )}
                          <Grid item xs={6}>
                            <Link underline="none" href={`/`}>
                              <Button size="small" variant="contained">
                                continue shopping
                              </Button>
                            </Link>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>
      ) : (
        <Typography variant="subtitle1" component="h3" color="text.secondary">
          Empty cart. Go shopping
        </Typography>
      )}
    </Box>
  );
};

CartItem.prototype = {
  checkout: PropTypes.bool.isRequired,
  setCheckout: PropTypes.func.isRequired,
};

export default CartItem;
