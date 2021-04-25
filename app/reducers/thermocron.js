import {READ_MISSION_DATA, CLEAR_MISSION_DATA, WRITE_MISSION_DATA, SET_TEMP_CONFIGURATION} from '../actions/thermocron';
import {CONFIGURATION_FETCHED} from "../actions/thermocron";

const defaultState = {
  minTmp: 35,
  maxTmp: 41,
  deviceId: null,
  missionRunningState: false,
  missionSample: 0,
  totalSample: 0,
  realTimeClock: 'DISABLED',
  realTimeClockValue: null,
  clockAlarm: 'DISABLED',
  lastMissionStarted: null,
  sampleRate: null,
  highTemperatureAlarm: 0,
  lowTemperatureAlarm: 0,
  rolloverEnabled: 'NO',
  readDelay: 0,
  log: [],
  parsedLog: [],
  tmpMinTmp: 35,
  tmpMaxTmp: 41
}

export default function thermocron(state = defaultState, action) {
  console.log(action);
  const payload = action.payload;
  switch (action.type) {
    case READ_MISSION_DATA:
      return {
        ...state,
        ...payload,
        parsedLog: parseLog(action.payload)
      };
    case WRITE_MISSION_DATA:
      return  {
        ...defaultState,
        ...payload,
        parsedLog:  []
      };
    case CLEAR_MISSION_DATA:
      return {
        ...state,
        deviceId: null,
        missionRunningState: false,
        missionSample: 0,
        totalSample: 0,
        realTimeClock: 'DISABLED',
        realTimeClockValue: null,
        clockAlarm: 'DISABLED',
        lastMissionStarted: null,
        sampleRate: null,
        highTemperatureAlarm: 0,
        lowTemperatureAlarm: 0,
        rolloverEnabled: 'NO',
        readDelay: 0,
        log: [],
        parsedLog: []
      };
    case CONFIGURATION_FETCHED:
      return {
        ...state,
        minTmp: parseInt(action.payload.minTmp, 10),
        maxTmp: parseInt(action.payload.maxTmp, 10),
        tmpMinTmp: parseInt(action.payload.minTmp, 10),
        tmpMaxTmp: parseInt(action.payload.maxTmp, 10),
      }
    case SET_TEMP_CONFIGURATION:
      return {
        ...state,
        ...payload
      }
    default:
      return state;
  }
}


const parseLog = (state) => {
  //take each day and create an inner array
  let parsedLog = [];
  let dailyMedian = [];
  Object.keys(state.log).forEach((index)=> {
    let [date, hour] = state.log[index]['date'].split(' ');
    if(typeof parsedLog[date] === 'undefined')
      parsedLog[date] = [];
    if(typeof dailyMedian[date] === 'undefined')
      dailyMedian[date] = 0;

    parsedLog[date][hour] = parseFloat(state.log[index]['value']);
  });

  return parsedLog;
}
