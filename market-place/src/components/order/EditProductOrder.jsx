import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import auth from "../../auth/AuthHelper";
import PropTypes from "prop-types";
import {
  update,
  cancelProduct,
  processCharge,
  getStatusValues,
} from "../../api/Api-Order";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
const useStyles = styled((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
    paddingBottom: 0,
  },
  listImg: {
    // width: "40px",
    // height: "40px",
    verticalAlign: "top",
    marginRight: "10px",
  },
  listDetails: {
    display: "inline-block",
  },
  listQty: {
    margin: 0,
    fontSize: "0.9em",
    color: "#5f7c8b",
  },
  textField: {
    width: "160px",
    marginRight: "16px",
  },
  statusMessage: {
    position: "absolute",
    zIndex: "12",
    right: "5px",
    padding: "5px",
  },
}));

const EditProductOrder = (props) => {
  const classes = useStyles();

  const [values, setValues] = useState({
    open: 0,
    statusValues: [],
    error: "",
  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    getStatusValues(signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: "Could not get status" });
      } else {
        setValues({ ...values, statusValues: data, error: "" });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleStatusChange = (productIndex) => (event) => {
    let order = props.order;
    order.products[productIndex].status = event.target.value;
    let product = order.products[productIndex];

    if (event.target.value === "Cancelled") {
      cancelProduct(
        {
          shopId: props.shopId,
          productId: product.product._id,
        },
        {
          t: jwt.token,
        },
        {
          cartItemId: product._id,
          status: event.target.value,
          quantity: product.quantity,
        }
      ).then((data) => {
        if (data.error) {
          setValues({
            ...values,
            error: "Status not updated, try again",
          });
        } else {
          props.updateOrders(props.orderIndex, order);
          setValues({
            ...values,
            error: "",
          });
        }
      });
    } else if (event.target.value === "Processing") {
      processCharge(
        {
          userId: jwt.user._id,
          shopId: props.shopId,
          orderId: order._id,
        },
        {
          t: jwt.token,
        },
        {
          cartItemId: product._id,
          status: event.target.value,
          amount: product.quantity * product.product.price,
        }
      ).then((data) => {
        console.log(`------ processing data ------`);
        console.log(data);
        if (data.error) {
          setValues({
            ...values,
            error: "Status not updated, try again",
          });
        } else {
          props.updateOrders(props.orderIndex, order);
          setValues({
            ...values,
            error: "",
          });
        }
      });
    } else {
      update(
        {
          shopId: props.shopId,
        },
        {
          t: jwt.token,
        },
        {
          cartItemId: product._id,
          status: event.target.value,
        }
      ).then((data) => {
        if (data.error) {
          setValues({
            ...values,
            error: "Status not updated, try again",
          });
        } else {
          props.updateOrders(props.orderIndex, order);
          setValues({
            ...values,
            error: "",
          });
        }
      });
    }
  };

  return (
    <div>
      <Typography
        component="span"
        color="error"
        className={classes.statusMessage}
      >
        {values.error}
      </Typography>
      <List disablePadding style={{ backgroundColor: "#f8f8f8" }}>
        {props.order.products.map((item, index) => {
          return (
            <span key={index}>
              {item.shop === props.shopId && (
                <ListItem button className={classes.nested}>
                  <ListItemText
                    primary={
                      <div>
                        <Stack direction="row" spacing={2}>
                          <Avatar
                            alt="Remy Sharp"
                            src={`${process.env.REACT_APP_API}/api/product/image/${item.product._id}`}
                          />
                        </Stack>
                        <div className={classes.listDetails}>
                          {item.product.name}
                          <p className={classes.listQty}>
                            {"Quantity: " + item.quantity}
                          </p>
                        </div>
                      </div>
                    }
                  />
                  <TextField
                    id="select-status"
                    select
                    label="Update Status"
                    className={classes.textField}
                    value={item.status}
                    onChange={handleStatusChange(index)}
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu,
                      },
                    }}
                    margin="normal"
                  >
                    {values.statusValues.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </ListItem>
              )}
              <Divider style={{ margin: "auto", width: "80%" }} />
            </span>
          );
        })}
      </List>
    </div>
  );
};

EditProductOrder.propTypes = {
  shopId: PropTypes.string.isRequired,
  order: PropTypes.object.isRequired,
  orderIndex: PropTypes.number.isRequired,
  updateOrders: PropTypes.func.isRequired,
};

export default EditProductOrder;
