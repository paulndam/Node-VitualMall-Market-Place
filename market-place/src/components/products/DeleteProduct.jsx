import React, { useState } from "react";
import PropTypes from "prop-types";
import auth from "../../auth/AuthHelper";
import { remove } from "../../api/Api-Product";
import { Redirect } from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteProduct = (props) => {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const jwt = auth.isAuthenticated();

  const clickButton = () => {
    setOpen(true);
  };

  const deleteProduct = () => {
    remove(
      {
        shopId: props.shopId,
        productId: props.product._id,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOpen(true);
        props.onRemove(props.product);
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        size="small"
        variant="contained"
        onClick={clickButton}
        color="error"
        sx={{ marginLeft: 1 }}
      >
        Delete
      </Button>
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Delete Product  "}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure about deleting this product ?
              <Box
                component="div"
                sx={{
                  marginTop: 2,
                }}
              >
                <CardMedia
                  component="img"
                  height="394"
                  image={require("../../assets/images/sad2.jpeg").default}
                  alt="Paella dish"
                />
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Stack direction="row" spacing={2}>
              <Button onClick={handleClose} variant="contained" color="warning">
                Cancel
              </Button>
              <Button onClick={deleteProduct} variant="contained" color="error">
                Confirm
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

DeleteProduct.propTypes = {
  shopId: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default DeleteProduct;
