import {TaskManagerAPI} from "../services/TaskManagerAPI";

export type TaskJSON = {
  _id?: string,
  description:string,
  completed: boolean,
  owner?: string
  createdAt?: string
  updatedAt?: string
}

export class Task {
  static path = '/tasks';
  path = '/tasks';
  private api?:TaskManagerAPI;
  constructor(
    public _id?:string, public description?:string, public completed:boolean=false, public owner?:string,
    public createdAt?:string, public updateAt?:string
  ) {}
  static fromJSON = (json:TaskJSON):Task => {
    return new Task(
      json._id,
      json.description,
      json.completed,
      json.owner,
      json.createdAt,
      json.updatedAt
    );
  }
  toJson = (): {} => {
    return {
      description: this.description,
      completed: this.completed
    }
  }
  setApi = (api:TaskManagerAPI) => {
    this.api = api;
  }
  update = async ():Promise<boolean> => {
    // console.log(this.description, this.completed, this.owner);
    if (this.api) {
      return await this.api.save(this);
    } else {
      return Promise.resolve(false);
    }
  }
  delete = async ():Promise<boolean> => {
    if (this.api) {
      return await this.api.delete(this);
    } else {
      return Promise.resolve(false);
    }
  }
}
