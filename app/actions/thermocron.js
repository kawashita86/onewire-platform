import {readIButtonData, readDemoIButtonData, writeIButtonData, writeDemoIButtonData} from "../utils/iButtonManager";
import {addUser, getUser} from "../utils/StorageAPI";
import {SET_DATA} from "./mission";

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
      let result = await readDemoIButtonData(); //readDemoIButtonData
//      result.log =  await readIButtonData('l');
      if(typeof result.deviceId === 'undefined'){
        dispatch({
          type: DATA_KO,
          payload: result.error
        })
      } else {
        //search User Based on thermocron device id
        console.log(result.deviceId);
        let userData = await getUser(result.deviceId);
        console.log(userData);
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
         type: DATA_KO,
         payload: 'Unable to read mission'
       })
    }
  }
}

export function writeMissionData() {
  return async(dispatch, getState) => {
    try {
      const mission = getState().mission;
      let result = await writeDemoIButtonData();  //writeIButtonData
      if(typeof result.deviceId === 'undefined' || result.deviceId.length === 0){
        dispatch({
          type: DATA_KO,
          payload: 'Unable to start mission'
        })
      } else {
        await addUser({nomePaziente: mission.nomePaziente, startDate: result.lastMissionStarted, deviceId: result.deviceId, tempoUtilizzo: mission.tempoUtilizzo})
        dispatch({
          type: WRITE_MISSION_DATA,
          payload: result
        })
      }
    } catch(e){
      dispatch({
        type: DATA_KO,
        payload: 'Unable to start mission'
      })
  }
  }
}

export function clearMissionData(){
  return {
    type: CLEAR_MISSION_DATA
  };
}
