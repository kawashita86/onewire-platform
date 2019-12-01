const path = require('path');
const fs = require('fs')
const currentPath = path.resolve(__dirname);
const moment = require('moment');

export async function readDemoIButtonData(options = null){
  return new Promise( function (resolve, reject) {
    try {
      let dataBuffer = fs.readFileSync(path.join(currentPath, '..', 'test', 'test.txt'), 'utf8');
      resolve(convertManager(dataBuffer, options));
    } catch(e) {
      console.log('Error:', e.stack);
      reject({
        error: e.message
      })
    }
   });
}

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
      fs.writeFile(path.join(currentPath,"logData.txt"), dataBuffer, function(err) {

      });
      if (code === 0)
        resolve(convertManager(dataBuffer, options));
      reject(dataBuffer);
    });
  });
}

export async function writeIButtonData(options) {
  return new Promise(async function (resolve, reject) {

    const child = require('child_process').spawn('cmd.exe', ['/c', 'run_initMission.bat < inputData.txt'],
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
      fs.writeFile(path.join(currentPath, "logWrite.txt"), dataBuffer, function (err) {

      });
      if (code === 0)
        resolve(dataBuffer);
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
        let components = innerRow.split(':');
        let key = components.shift();
        pureData[getLabelFromKey(key)] = components.join(':').trim();
      })
  return pureData;
}

export function convertDate(d){
  var parts = d.split(" ");
  var months = {Jan: "01",Feb: "02",Mar: "03",Apr: "04",May: "05",Jun: "06",Jul: "07",Aug: "08",Sep: "09",Oct: "10",Nov: "11",Dec: "12"};
  return parts[5]+"-"+months[parts[1]]+"-"+parts[2]+" "+parts[3];
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
      let components = innerRow.split(':');
      let key = components.shift();
      let value = components.join(':').trim();
      key = key.replace('-','').trim();
      if(key === 'Temperature recorded at') {
        index++;
        pureData[index] = {};
        pureData[index]['date'] = convertDate(value);
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
