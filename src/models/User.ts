import {TaskManagerAPI} from "../services/TaskManagerAPI";

export type UserJSON = {
  _id?: string,
  name: string,
  email: string,
  age?: number,
  createdAt?: string,
  updatedAt?: string
}

export class User {
  static path = '/users';
  path = '/users';
  mePath = true;
  private api?:TaskManagerAPI;
  constructor(
    public _id?:string, public name?:string, public email?:string, public age?:number,
    public createdAt?:string, public updateAt?:string
  ) {}
  static fromJSON = (json:UserJSON):User => {
    return new User(
      json._id,
      json.name,
      json.email,
      json.age,
      json.createdAt,
      json.updatedAt
    );
  }
  toJson = (): {} => {
    return {
      name: this.name,
      email: this.email,
      age: this.age
    }
  }
  setApi = (api:TaskManagerAPI) => {
    this.api = api;
  }
  update = async ():Promise<boolean> => {
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
