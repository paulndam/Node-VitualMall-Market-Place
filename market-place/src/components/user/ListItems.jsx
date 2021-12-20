import React from "react";
import auth from "../../auth/AuthHelper";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import { Redirect } from "react-router";
import Button from "@mui/material/Button";
import StoreIcon from "@mui/icons-material/Store";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";

export const mainListItems = (
  <div>
    <Link underline="none" href={`/allshops`}>
      <ListItem button>
        <ListItemIcon>
          <StoreIcon />
        </ListItemIcon>
        <ListItemText primary="All Shops" />
      </ListItem>
    </Link>

    {auth.isAuthenticated() && auth.isAuthenticated().user.seller && (
      <Link underline="none" href={`/seller/myshops`}>
        <ListItem button>
          <ListItemIcon>
            <StorefrontIcon />
          </ListItemIcon>
          <ListItemText primary="My Shops" />
        </ListItem>
      </Link>
    )}

    <Link underline="none" href={`/`}>
      <ListItem button>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
    </Link>
    <ListItem button>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>

      <Link href="/signin" underline="none" sx={{ color: "black" }}>
        <Button
          onClick={() => {
            auth.clearJWT(() => <Redirect to={"/signin"} />);
          }}
          variant="contained"
          color="error"
        >
          Log-Out
        </Button>
      </Link>
    </ListItem>

    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>More Actions</ListSubheader>
    {auth.isAuthenticated() && auth.isAuthenticated().user.seller && (
      <Link underline="none" href={`/seller/shop/new`}>
        <ListItem button>
          <ListItemIcon>
            <AddBusinessIcon />
          </ListItemIcon>
          <ListItemText primary="Add a shop" />
        </ListItem>
      </Link>
    )}
  </div>
);
