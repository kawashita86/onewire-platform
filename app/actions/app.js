export const DEVICE_ADDED = 'DEVICE_ADDED';
export const DEVICE_REMOVED = 'DEVICE_REMOVED';
export const ADAPTER_CONNECTED = 'ADAPTER_CONNECTED';
export const ADAPTER_REMOVED = 'ADAPTER_REMOVED';
export const DEVICE_SELECTED = 'DEVICE_SELECTED';


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

