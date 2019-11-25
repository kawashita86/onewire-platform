import { READ_MISSION_DATA, CLEAR_MISSION_DATA } from '../actions/thermocron';

const defaultState = {
  deviceId: null,
  missionRunningState: false,
  missionSample: 0,
  totalSample: 0,
  realTImeClock: 'DISABLED',
  realTimeClockValue: null,
  clockAlarm: 'DISABLED',
  lastMissionStarted: null,
  sampleRate: null,
  highTemperatureAlarm: 0,
  lowTemperatureAlarm: 0,
  rolloverEnabled: 'NO',
  readDelay: 0,
  dataSet: []
}

export default function thermocron(state, action) {
  switch (action.type) {
    case READ_MISSION_DATA:
      const payload = action.payload;
      return {
        ...state,
        payload
      };
    case CLEAR_MISSION_DATA:
      return defaultState;
    default:
      return state;
  }
}
