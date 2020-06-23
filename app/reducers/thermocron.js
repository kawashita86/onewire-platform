import {READ_MISSION_DATA, CLEAR_MISSION_DATA, WRITE_MISSION_DATA} from '../actions/thermocron';

const defaultState = {
  minTmp: 35,
  maxTmp: 41,
 // minTmp: 21,
 // maxTmp: 26,
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
      return defaultState;
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
