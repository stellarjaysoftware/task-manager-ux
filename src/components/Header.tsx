import React from 'react';
import {Navigation} from "./Navigation";
import {TaskManagerAPI} from "../services/TaskManagerAPI";

interface Props {
  taskAPI: TaskManagerAPI
}

export const Header = (props:Props) => {
  const styles = {
    appTitle: {
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '10px 0'
    }
  } as const;
  return (
    <React.Fragment>
      <div style={styles.appTitle}>Task Manager App</div>
      <Navigation {...props} />
    </React.Fragment>
  );
}
