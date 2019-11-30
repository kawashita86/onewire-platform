import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counter from './counter';
import thermocron from './thermocron';
import mission from './mission';

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    counter,
    thermocron,
    mission
  });
}
