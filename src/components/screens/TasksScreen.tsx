import React, {useState} from "react";
import {TaskRow} from "./TaskRow";
import {TaskManagerAPI} from "../../services/TaskManagerAPI";
import {Task} from "../../models/Task";
import {authRequired} from "../authRequired";

interface Props {
  taskAPI: TaskManagerAPI
}

const _TasksScreen = (props:Props) => {
  const [error, setError] = useState('');
  const initTasks:Task[] = [];
  const [tasks, setTasks] = useState(initTasks);
  const [noTasks, setNoTasks] = useState(false);
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const getTasks = async () => {
    // fetch tasks from the API
    const tasks:Task[] = await props.taskAPI.fetchTasks();
    setNoTasks(tasks.length === 0);
    setTasks(tasks);
  }

  if (tasks.length === 0 && !noTasks) {
    getTasks();
  }

  const handleCreate = async () => {
    setError('');
    const newTask = new Task(undefined, newTaskDesc);
    const create = await props.taskAPI.save(newTask);
    if(!create) {
      setError('Error creating task. Please try again.');
    } else {
      // refresh tasks
      setNewTaskDesc('');
      getTasks();
    }
  }

  const handleNewTaskInput = (event:React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskDesc(event.target.value);
  }

  return (
    <React.Fragment>
      <h1>Tasks</h1>
      <div>
        {tasks.map((task) => {
          return <TaskRow task={task} key={task._id}
                          onUpdate={() => getTasks()} onError={(error:string) => setError(error)} />
        })}
        {/* TODO: move add to separate component */}
        new task: <input type="text" value={newTaskDesc} onChange={handleNewTaskInput} />
               <button onClick={handleCreate}>add</button>
        {error ? <div style={{color: 'red', marginBottom: '10px'}}>{error}</div> : null}
      </div>
    </React.Fragment>
  );
}

export const TasksScreen = authRequired(_TasksScreen);
