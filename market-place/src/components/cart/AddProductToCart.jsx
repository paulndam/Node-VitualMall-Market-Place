import React, { useState } from "react";
import cart from "../cart/cartHelper";
import PropTypes from "prop-types";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Redirect } from "react-router-dom";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import IconButton from "@mui/material/IconButton";

const AddProductToCart = (props) => {
  const [redirect, setRedirect] = useState(false);

  const addProductToCart = () => {
    cart.addItem(props.item, () => {
      setRedirect({ redirect: true });
    });
  };

  if (redirect) {
    return <Redirect to={`/cart`} />;
  }

  return (
    <>
      {props.item.quantity >= 0 ? (
        <IconButton aria-label="add to favorites" onClick={addProductToCart}>
          <AddShoppingCartIcon />
        </IconButton>
      ) : (
        <IconButton aria-label="add to favorites">
          <RemoveShoppingCartIcon />
        </IconButton>
      )}
    </>
  );
};

AddProductToCart.propTypes = {
  item: PropTypes.object.isRequired,
};

export default AddProductToCart;
