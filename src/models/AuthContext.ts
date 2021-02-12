import React from "react";

export type setIsLoggedInType = (update:boolean) => void;

export type AuthContextType = {
 isLoggedIn: boolean,
 setIsLoggedIn: setIsLoggedInType
}

export const AuthContext = React.createContext({
  isLoggedIn: false,
  setIsLoggedIn: (update:boolean):void => {}
});
