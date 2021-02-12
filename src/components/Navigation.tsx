import React from 'react';
import {Link, useLocation} from 'react-router-dom';
// import {Redirect} from "react-router-dom";
import {TaskManagerAPI} from "../services/TaskManagerAPI";
import {AuthContext, AuthContextType, setIsLoggedInType} from "../models/AuthContext";

interface Props {
  taskAPI: TaskManagerAPI
}

export const Navigation = (props:Props):JSX.Element => {
  const { pathname } = useLocation();
  const styles = {
    nav: {
      display: 'grid',
      gridTemplateColumns: '50% 50%'
    },
    signInButton: {
      justifySelf: 'end'
    },
    screenButton: (name:string) => {
      return {
        fontWeight: pathname === `/${name}` ? 'bold' : 'normal',
        marginRight: '5px'
      } as const
    }
  };

  const handleSignOut = async (setIsLoggedIn:setIsLoggedInType) => {
    console.log('sign out');
    const loggedOut = await props.taskAPI.signOut();
    if(loggedOut) {
      setIsLoggedIn(false);
      document.location.href = "/";
    }
  }

  // <Redirect to="/" />
  return (
    <nav style={styles.nav}>
      <AuthContext.Consumer>
        {({isLoggedIn, setIsLoggedIn}: AuthContextType) => { return (
          !isLoggedIn ? null :
            <React.Fragment>
              <div>
                <Link to="/tasks">
                  <button style={styles.screenButton('tasks')}>Tasks</button>
                </Link>
                <Link to="/profile">
                  <button style={styles.screenButton('profile')}>Profile</button>
                </Link>
              </div>
              <div style={styles.signInButton}>
                <button onClick={() => handleSignOut(setIsLoggedIn)}>Sign Out</button>
              </div>
            </React.Fragment>
        )}}
      </AuthContext.Consumer>
    </nav>
  );
}
Navigation.context = AuthContext;
