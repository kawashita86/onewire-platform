import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import thermocron from './thermocron';
import mission from './mission';
import errors from './errors';
import app from "./app";

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    thermocron,
    mission,
    errors,
    app,
  });
}
