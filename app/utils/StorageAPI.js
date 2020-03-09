import {createConnection} from "typeorm";
var User = require("../model/User");

const electron = window.require('electron')
const path = electron.remote.require('path')
const sqlitePath = path.join(electron.remote.app.getPath('userData'), '\\data\\app.sqlite')
console.log('sqlite path', sqlitePath);

const options = {
  "type": "sqlite",
  "synchronize": true,
  "logging": true,
  "logger": "simple-console",
  "database": sqlitePath,
  "entities": [
    "app/model/*.js"
  ]
};

let connection = null;

const initConnection = async() => {
  if(!connection)
    connection = await createConnection(options);
  return connection;
}

export const addUser = async(data) => {
  try {
    await initConnection();
    console.log('addUser');
   // const userEntity = new User();

    const userEntity = {
      id : data.deviceId,
      startDate : data.startDate,
      endDate : typeof data.endDate !== 'undefined' ? data.endDate : "",
      nomePaziente : data.nomePaziente,
      tempoUtilizzo : data.tempoUtilizzo
    }

    return connection.getRepository(User).save(userEntity);
  } catch(error){
    console.log("Error: ", error)
  }
}

export const getUser = async(id) => {
  await initConnection();
  return await connection
    .getRepository(User)
    .findOne({ id: id });
}

export const getUsersWhere = async(id) => {
  await initConnection();
  return connection
    .getRepository(User)
    .findWhere({ id: id });
}

export const getAll = async () => {
  await initConnection();
  return connection
    .getRepository(User)
    .findAll();
}
