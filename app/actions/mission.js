import {addUser} from "../utils/StorageAPI";
import {ADD_ERROR, REMOVE_ERROR} from "../reducers/errors";

export const SET_DATA = 'SET_DATA';
export const CLEAR_DATA = 'CLEAR_DATA';
export const SET_NOME_PAZIENTE = 'SET_NOME_PAZIENTE';
export const SET_TEMPO_UTILIZZO = 'SET_TEMPO_UTILIZZO';
export const ANAGRAFICA_UPDATED = 'ANAGRAFICA_UPDATED';


export function setNomePaziente(nomePaziente){
  return {
    type: SET_NOME_PAZIENTE,
    payload: {nomePaziente}
  };
}

export function setTempoUtilizzo(tempoUtilizzo){
  return {
    type: SET_TEMPO_UTILIZZO,
    payload: {tempoUtilizzo}
  };
}

export function updateAnagrafica() {
  return async (dispatch, getState) => {

    try {
      const mission = getState().mission;
      const thermocron = getState().thermocron;
      await addUser({
        nomePaziente: mission.nomePaziente,
        startDate: thermocron.lastMissionStarted,
        deviceId: thermocron.deviceId,
        tempoUtilizzo: mission.tempoUtilizzo
      });
      dispatch({
        type: REMOVE_ERROR
      });
     // dispatch(asyncLoaded(TYPE_WRITE_MISSION));
      dispatch({
        type: ANAGRAFICA_UPDATED,
        payload: {}
      })

    } catch (e) {
      dispatch({
        type: ADD_ERROR,
        payload: e | "Impossibile aggiornare i dati, riprovare"
      })
    }
  }
}

