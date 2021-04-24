import {SET_DATA, CLEAR_DATA, SET_NOME_PAZIENTE, SET_TEMPO_UTILIZZO} from '../actions/mission';
import {DEVICE_SELECTED} from "../actions/app";

const defaultState = {
  name: null,
  missionState: null,
  startDate: null,
  endDate: null,
  tempoUtilizzo: '',
  nomePaziente: ''
}

export default function mission(state = defaultState, action) {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        ...action.payload
      };
    //case DEVICE_SELECTED:
    case CLEAR_DATA:
      return defaultState;
    case SET_TEMPO_UTILIZZO:
    case SET_NOME_PAZIENTE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
}
