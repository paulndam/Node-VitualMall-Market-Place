import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { listLatest, listCategories } from "../../api/Api-Product";
import auth from "../../auth/AuthHelper";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";
import MoreIcon from "@mui/icons-material/MoreVert";
import theme from "../../theme";
import { ThemeProvider } from "@mui/material/styles";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  SearchProduct,
  ProductCategory,
  SearchResults,
} from "../allComponents/AllComponents";
import Avatar from "@mui/material/Avatar";
import cart from "../cart/cartHelper";

const NavBar = withRouter(() => {
  const history = useHistory();
  const [suggestionTitle, setSuggestionTitle] = useState("Latest Products");
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  // useEffect(() => {
  //   const abortController = new AbortController();
  //   const signal = abortController.signal;
  //   listLatest(signal).then((data) => {
  //     if (data.error) {
  //       console.log(data.error);
  //     } else {
  //       setSuggestions(data);
  //     }
  //   });
  //   return function cleanup() {
  //     abortController.abort();
  //   };
  // }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listCategories(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* user is auth then show this and redirect them to their profile */}
      {auth.isAuthenticated() && (
        <>
          <Link
            underline="none"
            href={`/user/${auth.isAuthenticated().user._id}`}
            sx={{ color: "black" }}
          >
            <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
          </Link>
          {/* logout user if user is auth. */}
          <Link href={`/signin`} underline="none">
            <MenuItem onClick={handleMenuClose}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    auth.clearJWT(() => history.push(`/`));
                  }}
                >
                  LogOut
                </Button>
              </Stack>
            </MenuItem>
          </Link>
        </>
      )}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {auth.isAuthenticated() && (
        <Link
          underline="none"
          href={`/user/${auth.isAuthenticated().user._id}`}
          sx={{ color: "black" }}
        >
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Profile</p>
          </MenuItem>
        </Link>
      )}
      <Link underline="none" href={`/allshops`} sx={{ color: "black" }}>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show 4 new mails"
            color="inherit"
          >
            <Badge>
              <StoreIcon />
            </Badge>
          </IconButton>
          <p>All Shops</p>
        </MenuItem>
      </Link>

      {/* user is auth and is seller show this */}
      {auth.isAuthenticated() && (
        <>
          {auth.isAuthenticated().user.seller && (
            <Link
              underline="none"
              href={`seller/myshops/`}
              sx={{ color: "black" }}
            >
              <MenuItem>
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <Badge>
                    <StorefrontIcon />
                  </Badge>
                </IconButton>
                <p>My Shops</p>
              </MenuItem>
            </Link>
          )}

          <MenuItem>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Link underline="none" sx={{ color: "black" }} href={`/cart`}>
                <Badge badgeContent={cart.itemTotal()} color="error">
                  <AddShoppingCartIcon />
                </Badge>
              </Link>
            </IconButton>
            <p>Cart</p>
          </MenuItem>
          <Link underline="none" href={`/signin`} sx={{ color: "black" }}>
            <MenuItem>
              <Stack direction="row" spacing={2}>
                <IconButton size="large" aria-label="log-out" color="inherit">
                  <Badge>
                    <LogoutIcon />
                  </Badge>
                </IconButton>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => {
                    auth.clearJWT(() => history.push(`/`));
                  }}
                >
                  LogOut
                </Button>
              </Stack>
            </MenuItem>
          </Link>
        </>
      )}

      {/* {auth.isAuthenticated() && (
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show 4 new mails"
            color="inherit"
          >
            <Badge badgeContent={4} color="error">
              <AddShoppingCartIcon />
            </Badge>
          </IconButton>
          <p>Cart</p>
        </MenuItem>
      )} */}

      {!auth.isAuthenticated() && (
        <>
          <Link underline="none" href={`/signup`}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
              sx={{ marginLeft: 3, marginTop: 2 }}
            >
              <Link href="/signup" underline="none">
                <Button
                  onClick={() => history.push(`/signup`)}
                  variant="contained"
                  // color="success"
                  sx={{ backgroundColor: "secondary.main" }}
                  size="small"
                >
                  SignUp
                </Button>
              </Link>
              <Link href="/signin" underline="none">
                <Button
                  onClick={() => history.push(`/signin`)}
                  variant="contained"
                  color="success"
                  size="small"
                >
                  SignIn
                </Button>
              </Link>
            </Stack>
          </Link>
        </>
      )}

      {/* user is auth then show signout btn. */}
      {/* {auth.isAuthenticated() && (
        <Link underline="none" href={`/signin`} sx={{ color: "black" }}>
          <MenuItem>
            <Stack direction="row" spacing={2}>
              <IconButton size="large" aria-label="log-out" color="inherit">
                <Badge>
                  <LogoutIcon />
                </Badge>
              </IconButton>
              <Button size="small" variant="outlined" color="error">
                LogOut
              </Button>
            </Stack>
          </MenuItem>
        </Link>
      )} */}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ThemeProvider theme={theme}>
        <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
          <Toolbar>
            <Link underline="none" href={`/`} sx={{ color: "white" }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <HomeIcon />
              </IconButton>
            </Link>
            <Link underline="none" href={`/`} sx={{ color: "white" }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Zellers
              </Typography>
            </Link>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex", flexWrap: "wrap" } }}>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Link underline="none" href={`/`}>
                  <Button
                    onClick={""}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Home
                  </Button>
                </Link>

                <Link underline="none" href={`/allshops`}>
                  <Button
                    onClick={""}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    All Shops
                  </Button>
                </Link>

                {auth.isAuthenticated() && (
                  <>
                    {auth.isAuthenticated().user.seller && (
                      <Link underline="none" href={`/seller/myshops/`}>
                        <Button
                          onClick={""}
                          sx={{ my: 2, color: "white", display: "block" }}
                        >
                          My Shops
                        </Button>
                      </Link>
                    )}

                    <Link
                      underline="none"
                      href={`/user/${auth.isAuthenticated().user._id}`}
                    >
                      <Button
                        onClick={() => {
                          history.push(
                            `/user/${auth.isAuthenticated().user._id}`
                          );
                        }}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        Profile
                      </Button>
                    </Link>

                    <IconButton
                      size="large"
                      aria-label="show 4 new mails"
                      color="inherit"
                    >
                      <Link
                        underline="none"
                        sx={{ color: "whitesmoke" }}
                        href={`/cart`}
                      >
                        <Badge badgeContent={cart.itemTotal()} color="error">
                          <AddShoppingCartIcon />
                        </Badge>
                      </Link>
                    </IconButton>

                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <Avatar
                        alt="Remy Sharp"
                        src={`${process.env.REACT_APP_API}/api/users/photo/${
                          auth.isAuthenticated().user._id
                        }?${new Date().getTime()}`}
                      />
                    </IconButton>
                  </>
                )}
              </Box>

              {!auth.isAuthenticated() && (
                <Tooltip title="">
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                    sx={{ marginLeft: 3, marginTop: 2 }}
                  >
                    <Link href="/signup" underline="none">
                      <Button
                        onClick={() => history.push(`/signup`)}
                        variant="contained"
                        // color="success"
                        sx={{ backgroundColor: "secondary.main" }}
                        size="small"
                      >
                        SignUp
                      </Button>
                    </Link>
                    <Link href="/signin" underline="none">
                      <Button
                        onClick={() => history.push(`/signin`)}
                        variant="contained"
                        color="success"
                        size="small"
                      >
                        SignIn
                      </Button>
                    </Link>
                  </Stack>
                </Tooltip>
              )}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
});

export default NavBar;
