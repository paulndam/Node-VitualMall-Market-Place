import React, { useState, useEffect } from "react";
import auth from "../../auth/AuthHelper";
import { read, update } from "../../api/Api-Shop";
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
import Paper from "@mui/material/Paper";
import { SellersProduct } from "../allComponents/AllComponents";
import Divider from "@mui/material/Divider";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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

const Editshop = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    photo: "",
    redirect: false,
    error: "",
    id: "",
    // owner: "",
  });
  const jwt = auth.isAuthenticated();
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read(
      {
        shopId: match.params.shopId,
      },
      signal
    ).then((data) => {
      console.log(`read ---> `);
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
          owner: data.owner.name,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleSubmit = () => {
    let shopData = new FormData();
    values.name && shopData.append("name", values.name);
    values.description && shopData.append("description", values.description);
    values.photo && shopData.append("photo", values.photo);
    update(
      {
        shopId: match.params.shopId,
      },
      {
        t: jwt.token,
      },
      shopData
    ).then((data) => {
      console.log(`update ---> ${data}`);

      if (data.error) {
        setValues({ ...values, error: data.error });
        setSnackOpen(true);
      } else {
        setValues({ ...values, redirect: true });
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

  const logoUrl = values.id
    ? `/api/shops/logo/${values.id}?${new Date().getTime()}`
    : "/api/shops/defaultphoto";

  if (values.redirect) {
    return <Redirect to={"/seller/myshops"} />;
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
            Update Shop
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
                  Change Logo
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
                  label="Shop Name"
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
              <Typography type="subheading" component="h4">
                Owner: {values.owner}
              </Typography>
              <br />
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "other.dark" }}
              onClick={handleSubmit}
              //   color="success"
            >
              Add
            </Button>
            <Link href={`/seller/myshops`} underline="none">
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

        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={8} md={12}>
              <SellersProduct shopId={match.params.shopId} />
            </Grid>
          </Grid>
        </Box>

        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Editshop;
