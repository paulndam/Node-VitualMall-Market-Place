import React, { useState, useEffect } from "react";
import auth from "../../auth/AuthHelper";
import { update, read } from "../../api/Api-Product";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import theme from "../../theme";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Redirect } from "react-router";
import { styled } from "@mui/material/styles";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

const Input = styled("input")({
  display: "none",
});

const EditProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    category: "",
    quantity: "",
    price: "",
    photo: "",
    redirect: false,
    error: "",
  });
  const jwt = auth.isAuthenticated();
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ productId: match.params.productId }, signal).then((data) => {
      console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error });
        setSnackOpen(true);
      } else {
        setValues({
          ...values,
          id: data._id,
          name: data.name,
          description: data.description,
          category: data.category,
          quantity: data.quantity,
          price: data.price,
        });
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleSubmit = () => {
    let productData = new FormData();

    values.name && productData.append("name", values.name);
    values.description && productData.append("description", values.description);
    values.photo && productData.append("photo", values.photo);
    values.category && productData.append("category", values.category);
    values.quantity && productData.append("quantity", values.quantity);
    values.price && productData.append("price", values.price);

    update(
      {
        shopId: match.params.shopId,
        productId: match.params.productId,
      },
      { t: jwt.token },
      productData
    ).then((data) => {
      console.log(data);
      if (data.error) {
        console.log(`---error updating prdcts ---`);
        setValues({ ...values, error: data.error });
        setSnackOpen(true);
      } else {
        setValues({ ...values, error: "", redirect: true });
      }
    });
  };

  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSnackClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  const imageUrl = values.id
    ? `${process.env.REACT_APP_API}/api/product/image/${
        values._id
      }?${new Date().getTime()}`
    : `${process.env.REACT_APP_API}/api/product/defaultphoto`;

  if (values.redirect) {
    return <Redirect to={`/seller/shop/edit/${match.params.shopId}`} />;
  }

  return (
    <ThemeProvider theme={theme}>
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
            <LockOutlinedIcon />
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

          <Typography component="h1" variant="h5">
            Update Product
          </Typography>

          <Box sx={{ mt: 3, marginLeft: 3 }}>
            <Stack
              sx={{ marginBottom: 3 }}
              direction="row"
              alignItems="center"
              spacing={2}
            >
              <label htmlFor="contained-button-file">
                <Input
                  accept="image/*"
                  onChange={handleChange("photo")}
                  id="contained-button-file"
                  type="file"
                />
                <Button variant="contained" component="span">
                  Upload Picture
                </Button>
              </label>

              <span sx={{ marginLeft: "10px" }}>
                {values.photo ? values.photo.name : ""}
              </span>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Product Name"
                  name="name"
                  autoComplete="family-name"
                  value={values.name}
                  onChange={handleChange("name")}
                />
              </Grid>

              <Grid item xs={12}>
                <TextareaAutosize
                  maxRows={4}
                  aria-label="maximum height"
                  placeholder="type in shop description"
                  defaultValue="type in shop description"
                  style={{ width: 400, height: 100 }}
                  id="description"
                  label="description Address"
                  name="description"
                  autoComplete="description"
                  value={values.description}
                  onChange={handleChange("description")}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="category"
                  label="Shop Category"
                  name="category"
                  autoComplete="category"
                  value={values.category}
                  onChange={handleChange("category")}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  id="quantity"
                  label="Shop quantity"
                  name="quantity"
                  autoComplete="quantity"
                  value={values.quantity}
                  onChange={handleChange("quantity")}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  id="price"
                  label="Shop price"
                  name="price"
                  autoComplete="price"
                  value={values.price}
                  onChange={handleChange("price")}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "other.dark" }}
              onClick={handleSubmit}
              //   color="success"
              size="small"
            >
              Update
            </Button>
            <Link
              href={`/seller/shop/edit/${match.params.shopId}`}
              underline="none"
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                color="error"
              >
                Cancel
              </Button>
            </Link>
          </Box>
        </Box>

        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};

export default EditProduct;
