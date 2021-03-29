import {findIButton, findIButtonDemo} from "../utils/iButtonManager";
import {ADD_ERROR, REMOVE_ERROR} from "../reducers/errors";

export const DEVICE_ADDED = 'DEVICE_ADDED';
export const DEVICE_REMOVED = 'DEVICE_REMOVED';
export const ADAPTER_CONNECTED = 'ADAPTER_CONNECTED';
export const ADAPTER_REMOVED = 'ADAPTER_REMOVED';
export const DEVICE_SELECTED = 'DEVICE_SELECTED';
export const DEVICES_ADDED = 'DEVICES_ADDED';


export function retrieveDeviceList(){
  return async (dispatch, getState) => {
    try {
      const app = getState().app;
      if(!app.adapterConnected){
        dispatch({
          type: ADD_ERROR,
          payload: "E' necessario collegare il 1-Wire adapter prima di poter recuperare la lista iButton"
        })
        return;
      }
      let result = app.demo ? await findIButtonDemo() : await findIButton();
      if(typeof result.error !== 'undefined'){
        dispatch({
          type: ADD_ERROR,
          payload: result.error ? result.error : "Impossibile leggere la lista dei device, verificare la connessione e riprovare "
        })
      } else {
        dispatch({
          type: DEVICES_ADDED,
          payload: result
        });
        //search User Based on thermocron device id
        //for(let device of result.deviceList){
        //  dispatch({
        //    type: DEVICE_ADDED,
        //    payload: device
        //  });
        //}
      }
    } catch(e){
      dispatch({
        type: ADD_ERROR,
        payload: "Impossibile leggere la lista dei device, verificare la connessione e riprovare"
      })
    }
  }
}

export function addDevice(device){
  return {
    type: DEVICE_ADDED,
    payload: device
  };
}

export function removeDevice(device){
  return {
    type: DEVICE_REMOVED,
    payload: device
  };
}

export function adapterConnected(){
  return {
    type: ADAPTER_CONNECTED,
    payload: {}
  };
}

export function adapterRemoved(){
  return {
    type: ADAPTER_REMOVED,
    payload: {}
  };
}


export function selectDevice(deviceName){
  return {
    type: DEVICE_SELECTED,
    payload: deviceName
  };
}

