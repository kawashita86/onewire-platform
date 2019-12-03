import {SET_DATA, CLEAR_DATA, SET_NOME_PAZIENTE} from '../actions/mission';

const defaultState = {
  name: null,
  missionState: null,
  startDate: null,
  endDate: null,
  timeEmployed: null,
  nomePaziente: ''
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
    case SET_NOME_PAZIENTE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
}
