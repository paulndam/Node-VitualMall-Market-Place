import React, { useState, useEffect } from "react";
import { read, listRelated } from "../../api/Api-Product";
import { styled, ThemeProvider } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import theme from "../../theme";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { CardMedia } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import StoreIcon from "@mui/icons-material/Store";
import { SuggestedProducts } from "../allComponents/AllComponents";
import StorageIcon from "@mui/icons-material/Storage";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { AddProductToCart, Loading } from "../allComponents/AllComponents";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
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

const Product = ({ match }) => {
  const [product, setProduct] = useState({ shop: {} });
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setLoading(true);

    read({ productId: match.params.productId }, signal).then((data) => {
      console.log(data);
      if (data.error) {
        setError(data);
        setSnackOpen(true);
      } else {
        setLoading(false);
        setProduct(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.productId]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading(true);
    listRelated({ productId: match.params.productId }, signal).then((data) => {
      console.log(data);
      if (data.error) {
        setError(data);
        setSnackOpen(true);
      } else {
        setLoading(false);
        setSuggestions(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.productId]);

  const handleSnackClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  const imageUrl = product._id
    ? `${process.env.REACT_APP_API}/api/product/image/${
        product._id
      }?${new Date().getTime()}`
    : `${process.env.REACT_APP_API}/api/product/defaultphoto`;

  return (
    <ThemeProvider theme={theme}>
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
            {loading ? (
              <Loading />
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                  {/* <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  > */}
                  <Typography
                    sx={{ textAlign: "center" }}
                    variant="h5"
                    color="text.secondary"
                  >
                    {product.name}
                  </Typography>
                  {/* </Paper> */}
                </Grid>

                <Grid item xs={12} md={8} lg={9}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <CardMedia component="img" height="500" image={imageUrl} />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={8} lg={9}>
                  {/* <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  > */}
                  <ListItem button>
                    <ListItemIcon>
                      <PriceCheckIcon />
                    </ListItemIcon>
                    <ListItemText primary={product.price} />
                  </ListItem>
                  <Divider />
                  <ListItem button>
                    <ListItemIcon>
                      <AddProductToCart item={product} />
                    </ListItemIcon>
                    <ListItemText primary="Add To Cart" />
                  </ListItem>
                  <Divider />
                  <Link href={`/shops/${product.shop._id}`} underline="none">
                    <ListItem button>
                      <ListItemIcon>
                        <StoreIcon />
                      </ListItemIcon>
                      <ListItemText primary={`Sold at ${product.shop.name}`} />
                    </ListItem>
                  </Link>
                  <Divider />
                  <ListItem button>
                    <ListItemIcon>
                      <StorageIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        product.quantity > 0 ? `In Stock` : `Out of stock`
                      }
                      secondary={product.quantity}
                    />
                  </ListItem>
                  {/* </Paper> */}
                </Grid>

                <Grid item xs={12} md={8} lg={9}>
                  {/* <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  > */}
                  <Typography
                    sx={{ textAlign: "center" }}
                    variant="body1"
                    color="text.secondary"
                  >
                    {product.description}
                  </Typography>
                  {/* </Paper> */}
                </Grid>

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
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                    {"Related Products"}
                  </Typography>
                  {/* </Paper> */}
                </Grid>

                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={12} md={12}>
                    {loading ? (
                      <Loading />
                    ) : (
                      <SuggestedProducts products={suggestions} />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Container>
        </Box>
      </Box>
      <Copyright sx={{ pt: 4 }} />
    </ThemeProvider>
  );
};

export default Product;
