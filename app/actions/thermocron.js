import {readIButtonData, readDemoIButtonData, writeIButtonData, writeDemoIButtonData} from "../utils/iButtonManager";
import {addUser, getAll, getUser} from "../utils/StorageAPI";
import {SET_DATA} from "./mission";
import {ADD_ERROR, REMOVE_ERROR} from "../reducers/errors";

export const READ_MISSION_DATA = 'READ_MISSION_DATA';
export const READ_LOG_DATA = 'READ_LOG_DATA';
export const CLEAR_MISSION_DATA = 'CLEAR_MISSION_DATA';
export const WRITE_MISSION_DATA = 'WRITE_MISSION_DATA';
export const DATA_OK = 'DATA_OK';
export const DATA_KO = 'DATA_KO';


export function readMissionData() {
  return async (dispatch, getState) => {
      //we must use an async read through java children to get info
    try {
      const app = getState().app;
      const deviceAddress = app.selectedDevice ? app.selectedDevice.split('-')[0] : null;

      let result = app.demo ? await readDemoIButtonData() : await readIButtonData(deviceAddress);
      if(typeof result.deviceId === 'undefined'){
        dispatch({
          type: ADD_ERROR,
          payload: result.error ? result.error : "Impossibile leggere i dati, verificare la connessione al bottone e riprovare"
        })
      } else {
        //search User Based on thermocron device id
        //console.log(result.deviceId);
        let userData = await getUser(result.deviceId);
        console.log(userData);
        dispatch({
          type: REMOVE_ERROR
        });
        dispatch({
          type: SET_DATA,
          payload: userData
        });
        dispatch({
          type: READ_MISSION_DATA,
          payload: result
        })
      }
    } catch(e){
       dispatch({
         type: ADD_ERROR,
         payload: "Impossibile leggere i dati, verificare la connessione al bottone e riprovare"
       })
    }
  }
}

export function writeMissionData() {
  return async(dispatch, getState) => {
    try {
      const mission = getState().mission;
      const app = getState().app;
      let result =  app.demo ? await writeDemoIButtonData() : await writeIButtonData();
      if(typeof result.lastMissionStarted === "undefined")
        result.lastMissionStarted = new Date().toString();

     // return await addUser({nomePaziente: mission.nomePaziente, startDate: result.lastMissionStarted, deviceId: result.deviceId, tempoUtilizzo: mission.tempoUtilizzo});
      if(typeof result.deviceId === 'undefined' || result.deviceId.length === 0){
        dispatch({
          type: ADD_ERROR,
          payload: "Impossibile scrivere i dati, verificare la connessione al bottone e riprovare"
        })
      } else {
        await addUser({nomePaziente: mission.nomePaziente, startDate: result.lastMissionStarted, deviceId: result.deviceId, tempoUtilizzo: mission.tempoUtilizzo});
        dispatch({
          type: REMOVE_ERROR
        });
        dispatch({
          type: WRITE_MISSION_DATA,
          payload: result
        })
      }
    } catch(e){
      dispatch({
        type: ADD_ERROR,
        payload: e | "Impossibile scrivere i dati, verificare la connessione al bottone e riprovare"
      })
  }
  }
}

export function clearMissionData(){
  return {
    type: CLEAR_MISSION_DATA
  };
}
