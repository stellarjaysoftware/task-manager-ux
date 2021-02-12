import React, { useState} from "react";
import {TaskManagerAPI} from "../../services/TaskManagerAPI";
import {User} from "../../models/User";

interface Props {
  taskAPI: TaskManagerAPI
}

export const ProfileScreen = (props:Props) => {
  const initUser = new User();
  const [user, setUser] = useState(initUser);
  const [attemptedFetch, setAttemptedFetch] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAge, setNewAge] = useState(0);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  const getProfile = async () => {
    // fetch tasks from the API
    try {
      setAttemptedFetch(true);
      const user:User = await props.taskAPI.fetchUser();
      setUser(user);
    } catch (error){
      console.error(error);
    }
  }

  if (!attemptedFetch) {
    getProfile();
  }

  const handleDelete = async () => {
    setError('');
    if (window.confirm('Are you sure you want to delete your account?')) {
      if(await user.delete()){
        window.alert('Account deleted!');
        document.location.href = "/";
      } else {
        setError('Could not delete.  Please try again');
      }
    }
  }

  const handleEdit = () => {
    resetFields();
    setEditMode(true);
  }

  const handleSave = () => {
    user.name = newName;
    user.email = newEmail;
    user.age = newAge;
    user.update();
    setEditMode(false);
  }

  const handleCancel = () => {
    setEditMode(false);
    resetFields();
  }

  const resetFields = () => {
    setError('');
    setNewName(user.name || '');
    setNewEmail(user.email || '');
    setNewAge(user.age || 0);
  }

  const handleInputChange = (event:{target: {value:string}}, field:string) => {
    const newVal = event.target.value;
    setError('');
    switch (field) {
      case 'name':
        return setNewName(newVal);
      case 'email':
        return setNewEmail(newVal);
      case 'age':
        return newVal ? setNewAge(parseInt(newVal)) : setNewAge(0);
      default:
        break;
    }
  }

  const renderUser = () => {
    return (
      <React.Fragment>
        name: {user.name}<br />
        email: {user.email}<br />
        age: {user.age}<br /><br />
        <button onClick={handleEdit} title="edit">✏️</button> <button onClick={handleDelete} title="delete">🗑️</button>
      </React.Fragment>
    );
  }

  const renderEditUser = () => {
    return (
      <React.Fragment>
        <div className="fields">
          name: <input type="text" value={newName} onChange={event => handleInputChange(event, 'name')} />
          email: <input type="text" value={newEmail} onChange={event => handleInputChange(event, 'email')} />
          age: <input type="text" value={newAge} onChange={event => handleInputChange(event, 'age')} />
        </div>
        <button onClick={handleCancel} title="cancel">❌</button> <button onClick={handleSave} title="save">️💾</button>
      </React.Fragment>
    );
  }

  const getRenderer = () => {
    return editMode ? renderEditUser() : renderUser();
  }

  return (
    <React.Fragment>
      <h1>Profile</h1>
      <form>
        {
          user && user._id ? getRenderer() : <button onClick={() => setAttemptedFetch(false)}>try again</button>
        }
      </form>
      {error ? <div style={{color: 'red', marginBottom: '10px'}}>{error}</div> : null}
    </React.Fragment>
  );
}
