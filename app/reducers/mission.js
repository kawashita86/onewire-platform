import { SET_DATA, CLEAR_DATA } from '../actions/mission';

const defaultState = {
  name: null,
  missionState: null,
  startDate: null,
  endDate: null,
  timeEmployed: null
}

export default function mission(state = defaultState, action) {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        ...action.payload
      };
    case CLEAR_DATA:
      return defaultState;
    default:
      return state;
  }
}
