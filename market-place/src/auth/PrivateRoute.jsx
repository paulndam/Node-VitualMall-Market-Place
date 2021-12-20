import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../auth/AuthHelper";

const Privateroute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default Privateroute;
