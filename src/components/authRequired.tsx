import React from "react";
import {Redirect} from "react-router-dom";
import {AuthContext} from "../models/AuthContext";

export const authRequired = (ChildComponent:any) => {
  return (props:any) => {
    return (
      <AuthContext.Consumer>
        {({isLoggedIn}) => {
          return !isLoggedIn ? <Redirect to="/"/> : <ChildComponent {...props} />
        }}
      </AuthContext.Consumer>
    )
  }
}
