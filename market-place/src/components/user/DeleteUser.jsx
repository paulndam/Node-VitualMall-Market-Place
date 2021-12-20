import React, { useState } from "react";
import PropTypes from "prop-types";
import auth from "../../auth/AuthHelper";
import { remove } from "../../api/Api-User";
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

const DeleteUser = (props) => {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const jwt = auth.isAuthenticated();

  const clickButton = () => {
    setOpen(true);
  };

  const deleteAccount = () => {
    remove({ userId: props.userId }, { t: jwt.token }).then((data) => {
      if (data && data.error) {
        console.log(`Failed to delet account ${data.error}`);
      } else {
        auth.clearJWT(() => console.log(`User Account Deleted`));
        setRedirect(true);
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <Button variant="contained" onClick={clickButton} color="error">
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
          <DialogTitle>{"Delete Account  "}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              It's unfortunate to see you go. Are you sure about deleting your
              account ?
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
              <Button onClick={deleteAccount} variant="contained" color="error">
                Confirm
              </Button>
              <Button onClick={handleClose} variant="contained" color="warning">
                Cancel
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default DeleteUser;
