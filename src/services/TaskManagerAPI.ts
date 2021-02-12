import axios, {AxiosInstance} from 'axios';
import {Task, TaskJSON} from "../models/Task";
import {User} from "../models/User";

const TASKS_BASE_PATH = 'http://localhost:3000'

type IsDeletable = {
  _id?: string,
  path: string,
  mePath?:boolean,
}

type isSavable = {
  _id?: string,
  path: string,
  mePath?:boolean,
  toJson: () => {}
}

export class TaskManagerAPI {
  axios:AxiosInstance;
  constructor() {
    this.axios = axios.create({
      baseURL: TASKS_BASE_PATH
    });
  }

  private setAuthHeader = (authToken?:string):void => {
    this.axios.defaults.headers.common['Authorization'] = authToken ? `Bearer ${authToken}` : '';
  }

  private clearAuthHeader = ():void => {
    this.setAuthHeader();
  }

  signIn = async (email?:string, password?:string):Promise<boolean> => {
    const body = {
      "email": email,
      "password": password
    };
    const query = `${User.path}/login`;
    try {
      const response = await this.axios.post(query, body);
      const token = response.data.token;
      this.setAuthHeader(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  signOut = async ():Promise<boolean> => {
    const query = `${User.path}/logout`;
    try {
      await this.axios.post(query);
      this.clearAuthHeader();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  createUser = async (email?:string, password?:string, name?:string, age?:number):Promise<boolean> => {
    if (!email || !password) return false;
    const body: {[k: string]: any} = {
      "email": email,
      "password": password,
    };
    if (name) body["name"] = name;
    if (age) body["age"] = age;
    const query = User.path;
    try {
      const response = await this.axios.post(query, body);
      const token = response.data.token;
      this.setAuthHeader(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  // ex: /tasks?sortBy=createdAt&dir=asc&limit=2&skip=2
  fetchTasks = async ():Promise<Task[]> => {
    const query = Task.path;
    const tasks:Task[] = [];
    try {
      const response = await this.axios.get(query);
      if (response.data) {
        // parse the response and return an array of Task Objects
        response.data.forEach((json:TaskJSON) => {
          const task = Task.fromJSON(json);
          task.setApi(this);
          tasks.push(task);
        });
      }
      return tasks;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  fetchUser = async ():Promise<User> => {
    const query = `${User.path}/me`;
    let user = new User();
    try {
      const response = await this.axios.get(query);
      console.log(response);
      if (response.data) {
        user = User.fromJSON(response.data);
        user.setApi(this);
      }
    } catch (error) {
      console.error(error);
    }
    return user;
  }

  delete = async (item:IsDeletable):Promise<boolean> => {
    const query = `${item.path}/${item.mePath ? 'me' : item._id}`;
    try {
      const response = await this.axios.delete(query);
      console.log(response);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  save = async (item:isSavable):Promise<boolean> => {
    const isNew = !item._id;
    let query;
    try {
      if (isNew) {
        query = item.path;
      } else {
        // special "/me" path for profile saves
        query = `${item.path}/${item.mePath ? 'me' : item._id}`;
      }
      let response;
      if (isNew) {
        response = await this.axios.post(query, item.toJson());
      } else {
        response = await this.axios.patch(query, item.toJson());
      }
      console.log(response);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
