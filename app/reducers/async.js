export const LOADING = 'LOADING';
export const LOADED = 'LOADED';
export const ERROR = 'ERROR';
export const IDLE = 'IDLE';

export const STATUS_IDLE = 'idle';
export const STATUS_LOADING = 'loading';
export const STATUS_LOADED = 'loaded';

export const TYPE_CONFIGURATION = 'TYPE_CONFIGURATION';
export const TYPE_READ_MISSION = 'TYPE_READ_MISSION';
export const TYPE_WRITE_MISSION = 'TYPE_WRITE_MISSION';
export const TYPE_DEVICE_LIST = 'TYPE_DEVICE_LIST';

const defaultState = {
  type: null,
  status: STATUS_IDLE,
  error: null
}

export default function asyncManager(state = defaultState, action) {
  const payload = action.payload;
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        status: STATUS_LOADING,
        type: payload
      }
    case LOADED:
      return {
        ...state,
        status: STATUS_LOADED,
        type: payload
      }
    case IDLE:
      return {
        ...state,
        status: STATUS_IDLE,
        type: null
      }
    default:
      return state;
  }
}
