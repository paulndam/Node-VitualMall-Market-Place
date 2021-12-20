import React, { useState, useEffect } from "react";
import { read } from "../../api/Api-Order";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EmailIcon from "@mui/icons-material/Email";
import MoodIcon from "@mui/icons-material/Mood";
import CardMedia from "@mui/material/CardMedia";
import theme from "../../theme";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ListItemButton from "@mui/material/ListItemButton";
import { Loading } from "../allComponents/AllComponents";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/paulndam">
        Paul Ndam
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Order = ({ match }) => {
  const [order, setOrder] = useState({ products: [], delivery_address: {} });
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setLoading(true);
    read({ orderId: match.params.orderId }, signal).then((data) => {
      console.log(data);
      if (data.error) {
        console.log(`--error send req to read order ---`);
      } else {
        setLoading(false);
        setOrder(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const getTotal = () => {
    return order.products.reduce((acc, b) => {
      const quantity = b.status === "Cancelled" ? 0 : b.quantity;
      return acc + quantity * b.product.price;
    }, 0);
  };

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <Loading />
      ) : (
        <Box sx={{ width: "100%" }}>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            sx={{ marginTop: 5, marginBottom: 8 }}
          >
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
                sx={{ textAlign: "center", color: "black" }}
              >
                {"Order Details"}
              </Typography>
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            sx={{ marginTop: 5, marginBottom: 8 }}
          >
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                bgcolor: "#b6b8c3",
              }}
            >
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ textAlign: "center", color: "black" }}
              >
                Code:{""}
                <strong>{order._id}</strong>
                <br />
                {"Placed On"}: {new Date(order.created).toDateString()}
              </Typography>
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            sx={{ marginTop: 5, marginBottom: 8 }}
          >
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                bgcolor: "#e3f2fd",
              }}
            >
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ textAlign: "center", color: "black" }}
              >
                {"Total Payment"}: ${getTotal()}
              </Typography>
            </Paper>
          </Grid>
        </Box>
      )}

      <>
        {loading ? (
          <Loading />
        ) : (
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
                height: "100vh",
                overflow: "auto",
              }}
            >
              <Toolbar />
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                  {order.products.map((o, i) => (
                    <Grid item xs={12} md={8} lg={9} key={i}>
                      {/* <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      > */}
                      <Link href={`/product/${o.product._id}`} underline="none">
                        <Card sx={{ display: "flex" }} key={i}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              width: 1400,
                              mr: 1,
                            }}
                            key={i}
                          >
                            <CardContent sx={{ flex: "1 0 auto" }}>
                              <Link
                                underline="none"
                                href={`/product/${o.product._id}`}
                                sx={{ color: "black" }}
                              >
                                <Typography component="div" variant="h5">
                                  {o.product.name}
                                </Typography>
                              </Link>
                              <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                              >
                                Shop : {o.shop.name}
                              </Typography>

                              <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                              >
                                Price : ${o.product.price}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                //   color="text.secondary"
                                component="div"
                                color={
                                  o.status === "Cancelled"
                                    ? "error"
                                    : "text.secondary"
                                }
                              >
                                Status : ${o.status}
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
                              <IconButton aria-label="previous">
                                <Typography
                                  variant="h6"
                                  color="text.secondary"
                                  component="div"
                                  sx={{ textAlign: "center", color: "green" }}
                                >
                                  Total : ${" "}
                                  {`${Number(
                                    o.product.price * o.quantity
                                  ).toFixed(1)}`}
                                </Typography>
                              </IconButton>
                            </Box>
                          </Box>
                          <CardMedia
                            component="img"
                            height="194"
                            // sx={{ width: 35 }}
                            image={`${process.env.REACT_APP_API}/api/product/image/${o.product._id}`}
                            alt="edit account to upload image"
                          />
                        </Card>
                      </Link>
                      {/* </Paper> */}
                    </Grid>
                  ))}

                  {/* user delivery address section */}
                  <Grid item xs={12} md={4} lg={3}>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: 360,
                          bgcolor: "background.paper",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ textAlign: "center", color: "black" }}
                        >
                          {"Deliver To"}
                        </Typography>
                        <Divider />

                        <nav aria-label="main mailbox folders">
                          <List>
                            <ListItem disablePadding>
                              <ListItemButton>
                                <ListItemIcon>
                                  <MoodIcon />
                                </ListItemIcon>
                                <ListItemText primary={order.customer_name} />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton>
                                <ListItemIcon>
                                  <EmailIcon />
                                </ListItemIcon>
                                <ListItemText primary={order.customer_email} />
                              </ListItemButton>
                            </ListItem>
                          </List>
                        </nav>
                        <Divider />
                        <nav aria-label="secondary mailbox folders">
                          <List>
                            <ListItem disablePadding>
                              <ListItemText
                                sx={{ textAlign: "center" }}
                                primary={order.delivery_address.street}
                              />
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemText
                                sx={{ textAlign: "center" }}
                                primary={order.delivery_address.city}
                              />
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemText
                                sx={{ textAlign: "center" }}
                                primary={order.delivery_address.state}
                              />
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemText
                                sx={{ textAlign: "center" }}
                                primary={order.delivery_address.zipcode}
                              />
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemText
                                sx={{ textAlign: "center" }}
                                primary={order.delivery_address.country}
                              />
                            </ListItem>
                            <Divider />
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                              sx={{ textAlign: "center", color: "black" }}
                            >
                              {
                                "Thank you for shopping with us. See you next time"
                              }
                            </Typography>
                          </List>
                        </nav>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Box>
        )}
        <Copyright sx={{ pt: 4 }} />
      </>
    </ThemeProvider>
  );
};

export default Order;
