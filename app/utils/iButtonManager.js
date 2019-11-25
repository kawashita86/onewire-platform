const path = require('path');
const fs = require('fs')
const currentPath = path.resolve(__dirname);
/**
 * Function to read data from an iButton device using java api
 * options : [a: violation of history ,h: histogram for the mission,l: log of data registered,k: kill mission and get data,s: get data and stop mission]
 */
export async function readIButtonData(options = null) {
  //java -classpath OneWireAPI.jar;%classpath% dumpMission %1 %2
  const res = fs.existsSync(path.join(currentPath, '..', 'external', 'run_dumpMission.bat'));
  console.log('path Exists', res);
  return new Promise(async function (resolve, reject) {
    const child = require('child_process').spawn('cmd.exe', ['/c', 'run_dumpMission.bat', options],
      {
        cwd: path.join(currentPath, '..', 'external')
      });
    let dataBuffer = '';
    for await(const data of child.stdout) {
      //console.log(data.toString());
      dataBuffer += data.toString();
    }

    for await(const data of child.stderr) {
      //console.log(data.toString());
      dataBuffer += data.toString();
    }

    child.on('error', function (err) {
      // *** Process creation failed
      reject({
        error: err
      });
    });

    child.on('exit', code => {
      console.log(`Exit code is: ${code}`);
      fs.writeFile(path.join(currentPath,"test.txt"), dataBuffer, function(err) {

      });
      if (code === 0)
        resolve(convertManager(dataBuffer, options));
      reject(dataBuffer);
    });
  });
}

/**
 - Device ID : 8E0000004B393621
 - MISSION IS CURRENTLY RUNNING
 - Cannot read current temperature with mission in progress
 -----------------------------------------------------------
 - Number of mission samples: 44918
 - Total number of samples  : 44944
 - Real Time Clock          : ENABLED
 - Real Time Clock Value    : Sun Nov 24 20:18:18 CET 2019
 - Clock Alarm              : DISABLED
 - Last mission started     : Thu Oct 24 15:41:00 CEST 2019
 - Sample rate              : Every 1 minutes
 - High temperature alarm   : 85.0
 - Low temperature alarm    : -40.0
 - Rollover enabled         : NO
 - Time to read Thermocron  : 2494 milliseconds
 * @param data
 */
function convertRawDeviceData(data){
  let pureData = {};
      let rowEntry = data.split(/\r?\n/);
      rowEntry.map((innerRow) => {
        let [key, value] = innerRow.split(':');
        pureData[getLabelFromKey(key)] = value;
      })
  return pureData;
}

/**
 * convert data from raw log of temperature, align two rows into one
 * @param data
 */
function convertLogDeviceData(data){
  let pureData = {};
  let index = -1;
    let rowEntry = data.split(/\r?\n/);
    rowEntry.map((innerRow) => {
      let [key, value] = innerRow.split(':');
      key = key.replace('-','').trim();
      if(key === 'Temperature recorded at') {
        index++;
        pureData[index] = {};
        pureData[index]['date'] = value;
      }
      else if(key === 'was') {
        if(typeof pureData[index] === 'undefined')
          pureData[index-1]['value'] = value;
        else
          pureData[index]['value'] = value;
        index++;
      }
    })
  return pureData;
}

function convertHistogramDeviceData(data){
  return data;
}


function convertManager(data, options){
  let rawObj = {};
  switch(options){
    case('l'):
      rawObj.log = convertLogDeviceData(data);
    case('h'):
      rawObj.histogram = convertHistogramDeviceData(data);
    default:
      rawObj = convertRawDeviceData(data);
      rawObj.log = convertLogDeviceData(data);

  }

  return rawObj;
}

function getLabelFromKey(key){
   key = key.replace('-','').trim();
  switch(key){
    case('Device ID'):
      return 'deviceId';
    case('MISSION IS CURRENTLY RUNNING'):
      return 'missionRunningState';
    case('Number of mission samples'):
      return 'missionSample';
    case('Total number of samples'):
      return 'totalSample';
    case('Real Time Clock'):
      return 'realTimeClock';
    case('Real Time Clock Value'):
      return 'realTimeClockValue';
    case('Clock Alarm'):
      return 'clockAlarm';
    case('Last mission started'):
      return 'lastMissionStarted';
    case('Sample rate'):
      return 'sampleRate';
    case('High temperature alarm'):
      return 'highTemperatureAlarm';
    case('Low temperature alarm'):
      return 'lowTemperatureAlarm';
    case('Rollover enabled'):
      return 'rolloverEnabled';
    case('Time to read Thermocron'):
      return 'readDelay';
    default:
     return null;
  }
}
