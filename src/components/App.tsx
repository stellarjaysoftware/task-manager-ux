import React, {useState} from "react";
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import {AuthContext, AuthContextType} from "../models/AuthContext";
import {SignInScreen} from "./screens/SignInScreen";
import {TasksScreen} from "./screens/TasksScreen";
import {ProfileScreen} from "./screens/ProfileScreen";
import {Header} from "./Header";
// import './App.css';
import {TaskManagerAPI} from "../services/TaskManagerAPI";

const taskAPI = new TaskManagerAPI();

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const styles = {
    appWrapper: {
      maxWidth: "800px",
      margin: "10px auto",
      padding: "5px 20px"
    },
    appContent: {
      margin: "10px"
    }
  };

  // will be passed to all AuthContext.Consumer components
  const authState: AuthContextType = {
    isLoggedIn: isLoggedIn,
    setIsLoggedIn: (update: boolean): void => setIsLoggedIn(update)
  };

  return (
    <AuthContext.Provider value={authState}>
      <Router>
        <div style={styles.appWrapper}>
          <React.Fragment>
            <Header taskAPI={taskAPI}/>
            <div style={styles.appContent}>
              <Route path="/" exact={true}>
                <SignInScreen taskAPI={taskAPI} />
              </Route>
              <Route path="/tasks">
                <TasksScreen taskAPI={taskAPI} />
              </Route>
              <Route path="/profile">
                <ProfileScreen taskAPI={taskAPI} />
              </Route>
            </div>
          </React.Fragment>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
