import React, { useState } from "react";
import {Task} from "../models/Task";

interface Props {
  task: Task,
  onUpdate: () => {},
  onError: (error:string) => void
}

export const TaskRow = (props:Props) => {
  const [editMode, setEditMode] = useState(false);
  const [newDesc, setNewDesc] = useState(props.task.description);
  const styles = {
    taskWrapper: {
      display: 'grid',
      gridTemplateColumns: '50px auto 20%',
      borderBottom: 'solid 1px #ccc',
      marginBottom: '5px'
    },
    desc: (completed:boolean) => {
      return {
        cursor: 'pointer',
        textDecoration: completed ? 'line-through' : 'none'
      }
    }
  }

  const handleCheck = async () => {
    props.onError('');
    props.task.completed = !props.task.completed;
    if (await props.task.update()) {
      props.onUpdate();
    } else {
      props.onError('Could not update. Please try again');
    }
  }

  const handleDelete = async () => {
    props.onError('');
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Are you sure you want to delete?\n    "${props.task.description}"`)) {
      if(await props.task.delete()){
        props.onUpdate();
      } else {
        props.onError('Could not delete.  Please try again');
      }
    }
  }

  const handleEdit = () => {
    setEditMode(true);
  }

  const handleSave = () => {
    props.task.description = newDesc;
    props.task.update();
    setEditMode(false);
  }

  const handleCancel = () => {
    setEditMode(false);
    setNewDesc(props.task.description);
  }

  return(
    <div style={styles.taskWrapper}>
      <div>
        <input type="checkbox" checked={props.task.completed} onChange={() => handleCheck()} />
      </div>
      <div>
        {!editMode
          ? <div onClick={handleCheck} style={styles.desc(props.task.completed)}>{props.task.description}</div>
          : <input type="text" value={newDesc} onChange={(event) => setNewDesc(event.target.value)} />}
      </div>
      <div style={{justifySelf: 'end'}}>
        {!editMode
          ?<React.Fragment>
            <button onClick={handleEdit} title="edit">✏️</button> <button onClick={handleDelete} title="delete">🗑️</button>
          </React.Fragment>
          :<React.Fragment>
            <button onClick={handleCancel} title="cancel">❌</button> <button onClick={handleSave} title="save">️💾</button>
          </React.Fragment>}
      </div>
    </div>
  );
}
