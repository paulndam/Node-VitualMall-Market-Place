import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import auth from "../../auth/AuthHelper";
import { read, update } from "../../api/Api-User";
import { Redirect } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: "#43a047",
  padding: theme.spacing(1),
}));

const Input = styled("input")({
  display: "none",
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const label = { inputProps: { "aria-label": "Switch demo" } };

const theme = createTheme({
  palette: {
    primary: {
      light: "#1769aa",
      main: "#2196f3",
      dark: "#4dabf5",
      contrastText: "#fffde7",
    },
    secondary: {
      light: "#484848",
      main: "#000000",
      dark: "#000000",
      contrastText: "#ffcc00",
    },

    contrastThreshold: 3,
    tonalOffset: 0.2,
    openTitle: "#455a64",
    protectedTitle: "#f57c00",
    type: "light",
  },
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

const EditUser = ({ match }) => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
    photo: "",
    error: "",
    redirectToProfile: false,
    id: "",
    seller: false,
  });

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      console.log(data);
      if (data && data.error) {
        console.log(`Error reading user ${data.error}`);
        setValues({ ...values, error: data.error });
        setSnackOpen(true);
      } else {
        setValues({
          ...values,
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
          seller: data.seller,
        });
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const handleSnackClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  const handleCheck = (e, checked) => {
    setValues({ ...values, seller: checked });
  };

  const handleCancelEdit = () => {
    history.push(`/user/${values.id}`);
  };

  const handleSubmit = () => {
    console.log(`----- Calling handlesubmit func to edit ----`);
    let userData = new FormData();
    values.name && userData.append("name", values.name);
    values.email && userData.append("email", values.email);
    values.about && userData.append("about", values.about);
    values.passoword && userData.append("passoword", values.passoword);
    values.photo && userData.append("photo", values.photo);
    values.seller && userData.append("seller", values.seller);

    console.log(userData);

    console.log(`----- updating user. send req to back-end----`);

    update({ userId: match.params.userId }, { t: jwt.token }, userData).then(
      (data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({ ...values, redirectToProfile: true });
        }
      }
    );
  };

  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    setValues({ ...values, [name]: value });
  };

  const photoUrl = values.id
    ? `${process.env.REACT_APP_API}/api/users/photo/${
        values.id
      }?${new Date().getTime()}`
    : `${process.env.REACT_APP_API}/api/users/defaultphoto`;

  if (values.redirectToProfile) {
    return <Redirect to={`/user/${values.id}`} />;
  }

  return (
    <div>
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
            <Div sx={{ marginBottom: 5 }}>{"Edit Profile"}</Div>

            <Avatar src={photoUrl} sx={{ m: 1, bgcolor: "primary.main" }} />

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

            <Box sx={{ mt: 3 }}>
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
                    label="Full Name"
                    name="name"
                    autoComplete="family-name"
                    value={values.name}
                    onChange={handleChange("name")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange("email")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    value={values.password}
                    onChange={handleChange("password")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="say something about yourself"
                    style={{ width: 400 }}
                    id="about"
                    label="about"
                    name="about"
                    value={values.about}
                    onChange={handleChange("about")}
                  />
                </Grid>
              </Grid>
              <Div sx={{ marginTop: 5, backgroundColor: "#ffb300" }}>
                {"I want to be a seller"}
              </Div>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      {...label}
                      checked={values.seller}
                      onChange={handleCheck}
                      defaultChecked
                      color="success"
                    />
                  }
                  label={values.seller ? "Active" : "Inactive"}
                />
              </FormGroup>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "primary.main" }}
                onClick={handleSubmit}
              >
                Edit
              </Button>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="error"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default EditUser;
