import {User} from "../model/User";

const db = require('electron-db');
import {USERS_TABLE} from '../constants/database';

export const initUsersTable = async() => {
 //try {
//   let result = await db.valid(USERS_TABLE);
 //  return result;
 //} catch(err){
     db.createTable(USERS_TABLE, async (succ, msg) => {
       //if (!succ)
       //  throw  Error(msg)
       return true;
     })
 //  }
}

export const addUser = async(data) => {
   await initUsersTable();
  const userEntity = User(data);
  console.log(userEntity);
  try {
    let userData = await getUser(data.deviceId);
    console.log('FOUND', userData);
    delete userEntity.id;
      await db.updateRow(USERS_TABLE, {id: userData.id}, userEntity, async (succ, msg) => {
        console.log(succ);
        return await msg;
      });
  } catch(e){
    console.log('no user to delete');
    await db.insertTableContent(USERS_TABLE, userEntity, async(succ, msg) => {
      if(!succ)
        throw Error(msg)

      return await msg;
    });
  }
}

export const getUser = async(id) => {
    let userData = {};
    await db.getRows(USERS_TABLE, {deviceId: id}, async (succ, data) => {
      if (!succ)
        throw Error('Not Found!')
      if(data.length !== 0)
        userData = User(data[0]);
    });
    return userData;
}

export const getUsersWhere = async(id) => {
  await db.getRows(USERS_TABLE, {deviceId: id}, async (succ, data) => {
    if (!succ)
      throw Error('Not Found!')
    if(data.length !== 0)
      return data;
  });
  return [];
}

export const getAll = async () => {
  db.getAll(USERS_TABLE, async(succ, data) => {
    console.log(data);
     return data;
  })
}
