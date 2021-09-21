import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import thermocron from './thermocron';
import mission from './mission';
import errors from './errors';
import notify from './notify';
import app from "./app";
import asyncManager from "./async";

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    thermocron,
    mission,
    errors,
    notify,
    app,
    asyncManager
  });
}
