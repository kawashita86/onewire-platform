import {INCREMENT_COUNTER} from "./counter";
import {readIButtonData, readDemoIButtonData, writeIButtonData} from "../utils/iButtonManager";

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
      let result = await readIButtonData(); //readDemoIButtonData
//      result.log =  await readIButtonData('l');
      if(typeof result.deviceId === 'undefined'){
        dispatch({
          type: DATA_KO,
          payload: result.error
        })
      } else {
        dispatch({
          type: READ_MISSION_DATA,
          payload: result
        })
      }
    } catch(e){
       dispatch({
         type: DATA_KO,
         payload: result.error
       })
    }
  }
}

export function writeMissionData() {
  return async(dispatch, getState) => {
    try {
      let result = await writeIButtonData();
      console.log(result);
      dispatch({
        type: WRITE_MISSION_DATA,
        payload: result
      })
    } catch(e){
      dispatch({
        type: DATA_KO,
        payload: result.error
      })
  }
  }
}

export function clearMissionData(){
  return {
    type: CLEAR_MISSION_DATA
  };
}
