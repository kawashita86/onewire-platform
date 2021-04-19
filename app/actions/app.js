import {findIButton, findIButtonDemo} from "../utils/iButtonManager";
import {ADD_ERROR, REMOVE_ERROR} from "../reducers/errors";
import {addConfiguration, getConfiguration} from "../utils/StorageAPI";
import {TYPE_CONFIGURATION, TYPE_DEVICE_LIST} from "../reducers/async";
import {asyncIdle, asyncLoaded, asyncLoading} from "./async";

export const DEVICE_ADDED = 'DEVICE_ADDED';
export const DEVICE_REMOVED = 'DEVICE_REMOVED';
export const ADAPTER_CONNECTED = 'ADAPTER_CONNECTED';
export const ADAPTER_REMOVED = 'ADAPTER_REMOVED';
export const DEVICE_SELECTED = 'DEVICE_SELECTED';
export const DEVICES_ADDED = 'DEVICES_ADDED';
export const CONFIGURATION_FETCHED = 'CONFIGURATION_FETCHED';
export const NO_CONFIGURATION_FOUND = 'NO_CONFIGURATION_FOUND';


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
      dispatch(asyncLoading(TYPE_DEVICE_LIST));
      let result = app.demo ? await findIButtonDemo() : await findIButton();
      if(typeof result.error !== 'undefined'){
        dispatch({
          type: ADD_ERROR,
          payload: result.error ? result.error : "Impossibile leggere la lista dei device, verificare la connessione e riprovare "
        })
      } else {
        dispatch(asyncLoaded(TYPE_DEVICE_LIST));
        dispatch({
          type: DEVICES_ADDED,
          payload: result
        });
      }
    } catch(e){
      dispatch({
        type: ADD_ERROR,
        payload: "Impossibile leggere la lista dei device, verificare la connessione e riprovare"
      })
    }
    setTimeout(() => dispatch(asyncIdle()), 2000);
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

export function saveConfiguration(data) {
  return async (dispatch, getState) => {
    try {
      console.log(data);
      dispatch(asyncLoading(TYPE_CONFIGURATION));
      await addConfiguration({
        minTmp: data.minTmp,
        maxTmp: data.maxTmp,
        demo: getState().app.demo
      });
      dispatch({
        type: REMOVE_ERROR
      });
      dispatch({
        type: CONFIGURATION_FETCHED,
        payload: data
      })
      dispatch(asyncLoaded(TYPE_CONFIGURATION));
    }catch (e) {
      dispatch({
        type: ADD_ERROR,
        payload: e | "Impossibile aggiornare la configurazione"
      })
    }
    setTimeout(() => dispatch(asyncIdle()), 2000);
  }
}

export function fetchConfiguration() {
  return async (dispatch, getState) => {
    let configuration = await getConfiguration(1);
    if(typeof configuration !== "undefined" && configuration !== null){
      dispatch({
          type: CONFIGURATION_FETCHED,
          payload: configuration
        });
    }
    dispatch({
      type: NO_CONFIGURATION_FOUND
    });
  }
}

