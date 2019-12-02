import { READ_MISSION_DATA, CLEAR_MISSION_DATA } from '../actions/thermocron';

const defaultState = {
  minTmp: 21,
  maxTmp: 99,
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
  log: [],
  parsedLog: []
}

export default function thermocron(state = defaultState, action) {
  console.log(action);
  switch (action.type) {
    case READ_MISSION_DATA:
      const payload = action.payload;
      return {
        ...state,
        ...payload,
        parsedLog: parseLog(action.payload)
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
