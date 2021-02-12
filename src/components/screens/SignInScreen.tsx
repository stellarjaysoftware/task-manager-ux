import React, {useState} from "react";
import {AuthContext, AuthContextType, setIsLoggedInType} from "../../models/AuthContext";
import {TaskManagerAPI} from "../../services/TaskManagerAPI";
import {Redirect} from "react-router-dom";

interface Props {
  taskAPI: TaskManagerAPI
}

enum ScreenTitle {
  signIn = "Sign In",
  createAccount = "Create Account"
}

export const SignInScreen = (props:Props) => {
  const [screenTitle, setScreenTitle] = useState(ScreenTitle.signIn);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);

  const generalError = 'Please review entries and try again.';

  const handleSubmit = async (setIsLoggedIn:setIsLoggedInType) => {
    if (!email || !password) {
      return setError(generalError);
    }
    let isLoggedIn;
    if (screenTitle === ScreenTitle.createAccount) {
      isLoggedIn = await props.taskAPI.createUser(email, password, name, age);
      console.log('signIn response', isLoggedIn);
    } else {
      isLoggedIn = await props.taskAPI.signIn(email, password);
      console.log('signIn response', isLoggedIn);
    }
    if (isLoggedIn) {
      setIsLoggedIn(isLoggedIn);
    } else {
      setError(generalError);
    }
  }

  const handleInputChange = (event:{target: {value:string}}, field:string) => {
    const newVal = event.target.value;
      setError('');
      switch (field) {
        case 'email':
          return setEmail(newVal);
        case 'password':
          return setPassword(newVal);
        case 'name':
          return setName(newVal);
        case 'age':
          return newVal ? setAge(parseInt(newVal)) : setAge(0);
        default:
          break;
      }
  }

  return (
    <React.Fragment>
      <h1>{screenTitle}</h1>
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="fields">
          <label>email:</label> <input type="text" value={email} onChange={event => handleInputChange(event, 'email')} />
          <label>password (7):</label> <input type="password" value={password} onChange={event => handleInputChange(event, 'password')} />
          {screenTitle === ScreenTitle.createAccount ? <React.Fragment>
            <label>name:</label> <input type="text" value={name} onChange={event => handleInputChange(event, 'name')} />
            <label>age:</label> <input type="text" value={age} onChange={event => handleInputChange(event, 'age')} />
          </React.Fragment> : null}
        </div>
        {error ? <div style={{color: 'red', marginBottom: '10px'}}>{error}</div> : null}
        <AuthContext.Consumer>
          {({isLoggedIn, setIsLoggedIn}: AuthContextType) => {
            return !isLoggedIn
              ? <button onClick={() => handleSubmit(setIsLoggedIn)}>{screenTitle}</button>
              : <Redirect to="/tasks" />
          }}
        </AuthContext.Consumer>
        <br /><br />
        <div>
        {
          screenTitle === ScreenTitle.signIn
            ? <a onClick={() => setScreenTitle(ScreenTitle.createAccount)}>create account</a>
            : <a onClick={() => setScreenTitle(ScreenTitle.signIn)}>sign in using existing account</a>
        }
        </div>
        <br /><br />
      </form>
    </React.Fragment>
  );
}
