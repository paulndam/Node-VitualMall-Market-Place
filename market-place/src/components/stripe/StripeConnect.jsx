import React, { useState, useEffect } from "react";
import auth from "../../auth/AuthHelper";
import { stripeUpdate, createConnectStripeAccount } from "../../api/Api-User";
import queryString from "query-string";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";

const StripeConnect = (props) => {
  const [values, setValues] = useState({
    error: false,
    connecting: false,
    connected: false,
  });
  const jwt = auth.isAuthenticated();

  console.log(`---- jwt -------------`);
  console.log(jwt);

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

    const parsed = queryString.parse(props.location.search);
    console.log(`---- Parsed query string -------`);
    console.log(parsed);
    if (parsed.error) {
      setValues({ ...values, error: true });
    }
    if (parsed.code) {
      setValues({ ...values, connecting: true, error: false });
      //post call to stripe, get credentials and update user data
      stripeUpdate(
        {
          userId: jwt.user._id,
        },
        {
          t: jwt.token,
        },
        parsed.code,
        signal
      ).then((data) => {
        console.log(`===== stripe data front-end=====`);
        console.log(data);
        console.log(data);
        if (data.error) {
          setValues({
            ...values,
            error: true,
            connected: false,
            connecting: false,
          });
        } else {
          setValues({
            ...values,
            connected: true,
            connecting: false,
            error: false,
          });
        }
      });
    }
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
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
                  sx={{ textAlign: "center" }}
                >
                  {"Connect your stripe account"}
                </Typography>
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
                {values.error && (
                  <Typography variant="body2" color="text.secondary">
                    {
                      "Connection to your stripe account failed. Please try later"
                    }
                  </Typography>
                )}

                {values.connecting && (
                  <Typography variant="body2" color="text.secondary">
                    {"Connecting to your stripe account. Loading..."}
                  </Typography>
                )}

                {values.connected && (
                  <Typography variant="body2" color="text.secondary">
                    {
                      "Connection to your stripe account is been established successfully"
                    }
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default StripeConnect;
