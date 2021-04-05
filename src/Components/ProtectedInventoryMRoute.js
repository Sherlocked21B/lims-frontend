import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedInventoryMRoute = ({ component: Component, ...rest }) => {
  const state = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (
          state[0].role === "admin" ||
          state[0].role === "inventory_manager"
        ) {
          return <Component {...rest} {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedInventoryMRoute;
