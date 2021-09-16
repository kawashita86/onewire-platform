import {
  DEVICE_ADDED,
  DEVICE_REMOVED,
  ADAPTER_CONNECTED,
  ADAPTER_REMOVED,
  DEVICE_SELECTED,
  DEVICES_ADDED,
  CONFIGURATION_FETCHED
} from "../actions/app";

const defaultState = {
  demo: true,
  adapterConnected: false ,
  deviceList: null,
  selectedDevice: null,
}

export default function app(state = defaultState, action) {
  switch (action.type) {
    case DEVICES_ADDED:
      const selectedDevice  = state.selectedDevice!== null ? state.selectedDevice : (action.payload[0].adapterDetail+'_'+action.payload[0].address)
      return {
        ...state,
        deviceList: action.payload,
        selectedDevice: selectedDevice
      }
    case DEVICE_ADDED:
      return {
        ...state,
        deviceList: array.indexOf(action.payload) === -1 ? array.push(action.payload) : state.deviceList
      }
    case DEVICE_REMOVED:
      return {
        ...state,
        deviceList: state.selectedDevice.filter(device => device.name === action.payload)
      }
    case ADAPTER_CONNECTED:
    case ADAPTER_REMOVED:
      return {
        ...state,
        adapterConnected: action.type === ADAPTER_CONNECTED
      }
    case DEVICE_SELECTED:
      return {
        ...state,
        selectedDevice: action.payload
      }
    case CONFIGURATION_FETCHED:
      return {
        ...state,
       // demo: action.payload.demo
      }
    default:
      return state;
  }
}
