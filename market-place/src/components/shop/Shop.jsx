import React, { useState, useEffect } from "react";
import { read } from "../../api/Api-Shop";
import { listByShop } from "../../api/Api-Product";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Carousel from "react-material-ui-carousel";
import { CardMedia } from "@mui/material";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Container from "@mui/material/Container";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MoodIcon from "@mui/icons-material/Mood";
import { Products, Loading } from "../allComponents/AllComponents";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";

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
      <Link color="inherit" href="https://github.com/paulndam">
        Paul Ndam
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Shop = ({ match }) => {
  const [shop, setShop] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);
  const [loading, setLoading] = useState(false);

  const items = [
    {
      img: require("../../assets/images/sh1.jpeg").default,
    },
    {
      img: require("../../assets/images/sh2.jpeg").default,
    },
    {
      img: require("../../assets/images/sh3.jpeg").default,
    },
  ];

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setLoading(true);
    listByShop(
      {
        shopId: match.params.shopId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setLoading(false);
        setProducts(data);
      }
    });

    read(
      {
        shopId: match.params.shopId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setLoading(false);
        setShop(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.shopId]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setLoading(true);
    listByShop(
      {
        shopId: match.params.shopId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setLoading(false);
        setProducts(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.shopId]);

  const logoUrl = shop._id
    ? `${process.env.REACT_APP_API}/api/shops/logo/${
        shop._id
      }?${new Date().getTime()}`
    : "/api/shops/defaultphoto";

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sx={{ marginTop: 1 }}>
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <CardMedia
                      component="img"
                      height="440"
                      width="auto"
                      image={logoUrl}
                      alt="Paella dish"
                    />
                  </>
                )}
              </Grid>
            </Grid>

            <Divider />

            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ marginTop: 5, marginBottom: 5 }}
            >
              <Grid item xs={12} md={6}>
                <Carousel>
                  {items.map((item, i) => (
                    <ImageItem key={i} {...item} />
                  ))}
                </Carousel>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                alignItems="center"
                justifyContent="center"
                sx={{ backgroundColor: "" }}
              >
                {/* <Item> */}
                <CardContent sx={{ marginTop: 5 }}>
                  <Typography
                    variant="body1"
                    color="black"
                    sx={{ textAlign: "center" }}
                  >
                    {shop.description}
                  </Typography>
                </CardContent>
                {/* </Item> */}
              </Grid>
            </Grid>

            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: "30vh",
                overflow: "auto",
              }}
            >
              <Toolbar />
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
                      <List dense={dense}>
                        <ListItem>
                          <ListItemIcon>
                            <StoreMallDirectoryIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={shop.name}
                            secondary={secondary ? "Secondary text" : null}
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </Container>
            </Box>

            <Grid item xs={12} md={12} lg={12}>
              {/* <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              > */}
              <Typography variant="body2" color="text.secondary">
                {shop.description}
              </Typography>
              {/* </Paper> */}
            </Grid>

            <Divider variant="inset" component="div" />

            {/* product section */}
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              sx={{ marginTop: 5, marginBottom: 5 }}
            >
              {/* <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              > */}
              <Typography
                variant="h5"
                sx={{ textAlign: "center", color: "black" }}
              >
                {"Products"}
              </Typography>
              {/* </Paper> */}
            </Grid>
            {loading ? (
              <Loading />
            ) : (
              <Products products={products} searched={false} />
            )}
          </Box>
          <Copyright sx={{ pt: 4 }} />
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

export default Shop;
