import React, { useState, useEffect } from "react";
import auth from "../../auth/AuthHelper";
import { listByOwner } from "../../api/Api-Shop";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Carousel from "react-material-ui-carousel";
import { CardMedia } from "@mui/material";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { Redirect } from "react-router";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import { DeleteShop, Loading } from "../allComponents/AllComponents";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  marginTop: 5,
}));

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Sellershops = () => {
  const [shops, setShops] = useState([]);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();
  const [dense, setDense] = useState(false);
  const [loading, setLoading] = useState(false);

  const items = [
    {
      img: require("../../assets/images/bt5.jpeg").default,
    },
    {
      img: require("../../assets/images/bt6.jpeg").default,
    },
    {
      img: require("../../assets/images/bt7.jpeg").default,
    },
  ];

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setLoading(true);

    listByOwner({ userId: jwt.user._id }, { t: jwt.token }, signal).then(
      (data) => {
        console.log(data);
        if (data.error) {
          console.log(data.error);
          setRedirectToSignin(true);
        } else {
          setLoading(false);
          setShops(data);
        }
      }
    );

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const removeShop = (shop) => {
    const updatedShopsToRemove = [...shops];
    const index = updatedShopsToRemove.indexOf(shop);
    updatedShopsToRemove.splice(index, 1);
    setShops(updatedShopsToRemove);
  };

  if (redirectToSignin) {
    return <Redirect to={`/signin`} />;
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sx={{ marginTop: 1 }}>
                <Carousel>
                  {items.map((item, i) => (
                    <ImageItem key={i} {...item} />
                  ))}
                </Carousel>
              </Grid>
            </Grid>
            <Divider />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <List dense={dense}>
                      <Stack sx={{ marginTop: 3 }} direction="row" spacing={2}>
                        <Link href={`/seller/shop/new`} underline="none">
                          <Button variant="contained" color="success">
                            Add New Shop
                          </Button>
                        </Link>
                      </Stack>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Container>

            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              sx={{ marginTop: 5 }}
            >
              {shops.map((shop, index) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  key={index}
                  sx={{ marginTop: 5 }}
                >
                  <Card sx={{ maxWidth: 345, marginLeft: 2, marginRight: 2 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      src={`${process.env.REACT_APP_API}/api/shops/logo/${shop._id}?w=248&fit=crop&auto=format`}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {shop.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {`${shop.description.substring(0, 100)}...`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {auth.isAuthenticated().user &&
                        auth.isAuthenticated().user._id === shop.owner._id && (
                          <>
                            <Link
                              href={`/seller/${shop._id}/products/new`}
                              underline="none"
                            >
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                              >
                                Add Product
                              </Button>
                            </Link>

                            <Link
                              href={`/seller/orders/${shop.name}/${shop._id}/`}
                              underline="none"
                            >
                              <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                              >
                                View Orders
                              </Button>
                            </Link>
                          </>
                        )}
                    </CardActions>
                    <CardActions>
                      <Link href={`/shops/${shop._id}`} underline="none">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                        >
                          {"More"}
                        </Button>
                      </Link>
                      {auth.isAuthenticated().user &&
                        auth.isAuthenticated().user._id === shop.owner._id && (
                          <>
                            <Link
                              href={`/seller/orders/${shop.name}/${shop._id}`}
                              underline="none"
                            >
                              <Button
                                variant="contained"
                                color="warning"
                                size="small"
                              >
                                {"Orders"}
                              </Button>
                            </Link>

                            <Link
                              href={`/seller/shop/edit/${shop._id}`}
                              underline="none"
                            >
                              <Button
                                variant="contained"
                                sx={{ backgroundColor: "#c2185b" }}
                                size="small"
                              >
                                {"Update"}
                              </Button>
                            </Link>

                            <DeleteShop shop={shop} onRemove={removeShop} />
                          </>
                        )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

const ImageItem = ({ img }) => {
  return (
    <CardMedia
      component="img"
      height="540"
      width="auto"
      image={img}
      alt="Paella dish"
    />
  );
};

export default Sellershops;
