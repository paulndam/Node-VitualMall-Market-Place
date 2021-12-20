import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import auth from "../../auth/AuthHelper";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { DeleteShop } from "../allComponents/AllComponents";
import { listByShop } from "../../api/Api-Order";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { EditProductOrder } from "../allComponents/AllComponents";

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const useStyles = styled((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(
      1
    )}px`,
    color: theme.palette.protectedTitle,
    fontSize: "1.2em",
  },
  subheading: {
    marginTop: theme.spacing(1),
    color: "#434b4e",
    fontSize: "1.1em",
  },
  customerDetails: {
    paddingLeft: "36px",
    paddingTop: "16px",
    backgroundColor: "#f8f8f8",
  },
}));

export default function ShopOrders({ match }) {
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);

  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(0);

  const jwt = auth.isAuthenticated();
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listByShop(
      {
        shopId: match.params.shopId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data);
      } else {
        setOrders(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleClick = (index) => (event) => {
    setOpen(index);
  };

  const updateOrders = (index, updatedOrder) => {
    let updatedOrders = orders;
    updatedOrders[index] = updatedOrder;
    setOrders([...updatedOrders]);
  };

  return (
    <div>
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
            // height: "100vh",
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
                  <Typography
                    sx={{ textAlign: "center", color: "black" }}
                    variant="h5"
                  >
                    {match.params.shop} Shop Orders
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <List dense sx={{ mt: 3, mb: 3 }}>
              {orders.map((order, index) => {
                return (
                  <span key={index}>
                    <ListItem button onClick={handleClick(index)}>
                      <ListItemText
                        primary={"Order # " + order._id}
                        secondary={new Date(order.created).toDateString()}
                      />
                      {open === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Divider />
                    <Collapse
                      component="li"
                      in={open === index}
                      timeout="auto"
                      unmountOnExit
                    >
                      <EditProductOrder
                        shopId={match.params.shopId}
                        order={order}
                        orderIndex={index}
                        updateOrders={updateOrders}
                      />
                      <div className={classes.customerDetails}>
                        <Typography
                          type="subheading"
                          component="h3"
                          className={classes.subheading}
                          sx={{ textAlign: "center" }}
                        >
                          Deliver to:
                        </Typography>
                        <Typography
                          type="subheading"
                          component="h3"
                          color="text.secondary"
                          sx={{ textAlign: "center" }}
                        >
                          <strong>{order.customer_name}</strong> (
                          {order.customer_email})
                        </Typography>
                        <Typography
                          type="subheading"
                          component="h3"
                          color="text.secondary"
                          sx={{ textAlign: "center" }}
                        >
                          {order.delivery_address.street}
                        </Typography>
                        <Typography
                          type="subheading"
                          component="h3"
                          color="text.secondary"
                          sx={{ textAlign: "center" }}
                        >
                          {order.delivery_address.city},{" "}
                          {order.delivery_address.state}{" "}
                          {order.delivery_address.zipcode}
                        </Typography>
                        <Typography
                          type="subheading"
                          component="h3"
                          color="text.secondary"
                          sx={{ textAlign: "center" }}
                        >
                          {order.delivery_address.country}
                        </Typography>
                        <br />
                      </div>
                    </Collapse>
                    <Divider />
                  </span>
                );
              })}
            </List>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
