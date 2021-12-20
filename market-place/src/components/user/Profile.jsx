import React, { useState, useEffect } from "react";
import auth from "../../auth/AuthHelper";
import { read } from "../../api/Api-User";
import { Redirect } from "react-router-dom";
import { styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "./ListItems";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EmailIcon from "@mui/icons-material/Email";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import MoodIcon from "@mui/icons-material/Mood";
import CardMedia from "@mui/material/CardMedia";
import theme from "../../theme";
import { DeleteUser } from "../allComponents/AllComponents";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Avatar from "@mui/material/Avatar";
import { stripeUpdate, createConnectStripeAccount } from "../../api/Api-User";
import { MyOrders, Loading } from "../allComponents/AllComponents";

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

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const Profile = ({ match }, props) => {
  const [user, setUser] = useState({});
  const [redirectToSignIn, setRedirectToSignIn] = useState(false);
  const jwt = auth.isAuthenticated();
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      const res = await createConnectStripeAccount(jwt.token);
      console.log(`---- res----> `);
      console.log(res);
      window.location.href = res.data;
    } catch (error) {
      console.log(`--- stripe connection failed. try later -----`);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading(true);
    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      //   console.log(data);
      if (data && data.error) {
        setRedirectToSignIn(true);
      } else {
        console.log(`--- user data infor ---`);
        console.log(data);
        setLoading(false);
        setUser(data);
        //   setValues({user:data})
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId, jwt.token]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const photoUrl = user._id
    ? `${process.env.REACT_APP_API}/api/users/photo/${
        user._id
      }?${new Date().getTime()}`
    : `${process.env.REACT_APP_API}/api/users/defaultphoto`;

  if (redirectToSignIn) {
    return <Redirect to="/signin" />;
  }

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Drawer variant="permanent" open={open}>
              <Toolbar
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  px: [1],
                }}
              >
                <IconButton onClick={toggleDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              </Toolbar>
              <Divider />
              <List>{mainListItems}</List>
              <Divider />
              <List>{secondaryListItems}</List>
            </Drawer>

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
                  {/* user information */}
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
                            <MoodIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={user.name}
                            secondary={secondary ? "Secondary text" : null}
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                          <ListItemIcon>
                            <EmailIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={user.email}
                            secondary={secondary ? "Secondary text" : null}
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        {user.seller && (
                          <ListItem>
                            <ListItemIcon>
                              <AccountBoxIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={user.seller && `Seller Account Active`}
                              secondary={secondary ? "Secondary text" : null}
                            />
                          </ListItem>
                        )}
                        <Divider variant="inset" component="li" />
                        <ListItem>
                          <ListItemIcon>
                            <DateRangeIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Joined on : ${new Date(
                              user.created
                            ).toDateString()}`}
                            secondary={secondary ? "Secondary text" : null}
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        {auth.isAuthenticated().user &&
                          auth.isAuthenticated().user._id === user._id && (
                            <Stack
                              sx={{ marginTop: 3 }}
                              direction="row"
                              spacing={2}
                            >
                              <Link
                                href={`/user/edit/${user._id}`}
                                underline="none"
                              >
                                <Button variant="contained" color="success">
                                  Edit
                                </Button>
                                {console.log(`=======USER=====`)}
                                {console.log(user)}
                                {console.log(user.seller)}
                                {console.log(user.stripe_seller)}
                              </Link>

                              <DeleteUser userId={user._id} />

                              {auth.isAuthenticated().user.seller &&
                                (auth.isAuthenticated().user.stripe_seller ? (
                                  <Button variant="contained" color="warning">
                                    stripe connected
                                  </Button>
                                ) : (
                                  // <>
                                  //   <Button
                                  //     onClick={handleClick}
                                  //     variant="contained"
                                  //     color="warning"
                                  //   >
                                  //     <Avatar
                                  //       alt="Travis Howard"
                                  //       src={
                                  //         require("../../assets/images/stripe.png")
                                  //           .default
                                  //       }
                                  //     />
                                  //   </Button>
                                  // </>

                                  <Link
                                    href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID2}&scope=read_write`}
                                    underline="none"
                                  >
                                    <Avatar
                                      alt="Travis Howard"
                                      src={
                                        require("../../assets/images/stripe.png")
                                          .default
                                      }
                                    />
                                  </Link>
                                ))}
                            </Stack>
                          )}
                      </List>
                    </Paper>
                  </Grid>

                  {/* user profile picture section */}
                  <Grid item xs={12} md={4} lg={3}>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: 240,
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="194"
                        image={photoUrl}
                        alt="edit account to upload image"
                      />
                    </Paper>
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
                      <Typography variant="body2" color="text.secondary">
                        {!user.about
                          ? `Update Profile and fill in a brief describtion about you.`
                          : user.about}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <Typography
                        component="h2"
                        variant="h6"
                        color="primary"
                        gutterBottom
                      >
                        Recent Orders
                      </Typography>

                      {loading ? <Loading /> : <MyOrders />}
                    </Paper>
                  </Grid>
                </Grid>
                <Copyright sx={{ pt: 4 }} />
              </Container>
            </Box>
          </Box>
        </>
      )}
    </ThemeProvider>
  );
};

export default Profile;
