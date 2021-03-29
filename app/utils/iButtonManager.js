const path = require('path');
const fs = require('fs')
const electron = window.require('electron')
const currentPath = path.join(electron.remote.app.getPath('userData'), '\\data')
const log = require('electron-log')

function checkExternalPath(){
  let resourcePath = '';
  let checkExtResource = fs.existsSync(path.join(process.resourcesPath, 'external'));
  let checkIntResource = fs.existsSync(path.join(__dirname , '..', 'external'));
  if(checkExtResource){
    resourcePath = path.join(process.resourcesPath, 'external');
  }
  if(checkIntResource){
    resourcePath = path.join(__dirname , '..', 'external');
  }

  return resourcePath;
}

async function readFromShellInvoke(scriptName, options, success, error){
  let resourcePath = checkExternalPath();

  return new Promise(async function (resolve, reject) {
    log.info('connecting to java bridge for '+scriptName);
    const child = require('child_process').spawn(process.env.ComSpec, ['/c', scriptName, options],
      {
        cwd: resourcePath
      });
    let dataBuffer = '';
    for await(const data of child.stdout) {
      dataBuffer += data.toString();
    }

    for await(const data of child.stderr) {
      dataBuffer += data.toString();
    }

    child.on('error', function (err) {
      // *** Process creation failed
      log.info(err.message)
      reject({
        error: err
      });
    });

    child.on('exit', code => {
      log.info(`Exit code is: ${code}`)
      log.info(dataBuffer)
      if (code === 0) {
        resolve(success(dataBuffer, options));
      }
      reject(dataBuffer);
    });
  });
}

export async function readDemoIButtonData(options = null){
  return new Promise( function (resolve, reject) {
    try {
      log.info('readDemoIButtonData')

      let dataBuffer = fs.readFileSync(path.join(currentPath, 'logData.txt'), 'utf8');
      resolve(convertManager(dataBuffer, options));
    } catch(e) {
      log.error(e.stack)
      reject({
        error: e.message
      })
    }
   });
}

export async function writeDemoIButtonData(options = null){
  return new Promise( function (resolve, reject) {
    try {
     // let dataBuffer = fs.readFileSync(path.join(currentPath, 'logWrite.txt'), 'utf8');
      let dataBuffer = "Initializing mission on iButton 8E0000004B393621\n";
      log.info(dataBuffer);
      resolve(readLogDeviceId(dataBuffer));
    } catch(e) {
      console.log('Error:', e.stack);
      reject({
        error: e.message
      })
    }
  });
}


export async function findIButtonDemo(options = null) {
  return new Promise( function (resolve, reject) {
    try {
      // let dataBuffer = fs.readFileSync(path.join(currentPath, 'logWrite.txt'), 'utf8');
      let adapter = 'DS12110/USB';
      let devices = [
        {
          name: 'Thermocron1',
          address: '8E0000004B393621',
          description: 'Button for analysis of temperature'
        },
        {
          name: 'Thermocron2',
          address: '8E0000004B393622',
          description: 'Button for analysis of temperature'
        }
      ];
      let dataBuffer = "Adapter/Port\tiButton Type and ID\t\tDescription\n";
      dataBuffer += "----------------------------------------------------------------\n";
      for(let ibutton of devices){
        dataBuffer +=   adapter + "\t"
          + ibutton.name + "\t"
          + ibutton.address + "\t"
          + ibutton.description.substring(0, 25) + "...\n";
      }
      resolve(readDeviceList(dataBuffer, options));
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
  return await readFromShellInvoke('run_dumpMission.bat', options, (dataBuffer, options) => {
    convertManager(dataBuffer, options)
  });
}

/**
 * Function to start a new mission on a iButton device using java api
 * @param options
 * @returns {Promise<unknown>}
 */
export async function writeIButtonData(options) {
  //java -classpath OneWireAPI.jar;%classpath% initMission %1 %2
  return await readFromShellInvoke('run_initMission.bat < inputData.txt', options, (dataBuffer, options) => {
    readLogDeviceId(dataBuffer, options)
  });
}


export async function findIButton(options = null) {
  //java -classpath OneWireAPI.jar;%classpath% initMission %1 %2
  return await readFromShellInvoke('run_findIButton.bat', options, (dataBuffer, options) => {
    readDeviceList(dataBuffer, options);
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

export function convertDate(d, onlyMonth = false){
  var parts = d.split(" ");
  var months = {Jan: "01",Feb: "02",Mar: "03",Apr: "04",May: "05",Jun: "06",Jul: "07",Aug: "08",Sep: "09",Oct: "10",Nov: "11",Dec: "12"};
  if(onlyMonth)
    return parts[5]+"-"+months[parts[1]]+"-"+parts[2];
  return parts[5]+"-"+months[parts[1]]+"-"+parts[2]+" "+parts[3];
}

function readLogDeviceId(data){
  let pureData = {};
  let rowEntry = data.split(/\r?\n/);
  rowEntry.map((innerRow) => {
    if(innerRow.indexOf('Initializing mission on iButton') !== -1) {
      let components = innerRow.replace('Initializing mission on iButton', '');
      pureData['deviceId'] = components.trim();
    }

  });
  //pureData['lastMissionStarted'] = new Date().toISOString();
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

function readDeviceList(dataBuffer, options) {
  /**
   * "Adapter/Port\tiButton Type and ID\t\tDescription"
   */
  /**                        adapter.getAdapterName() + "/" + port_name + "\t"
   + ibutton.getName() + "\t"
   + ibutton.getAddressAsString() + "\t"
   + ibutton.getDescription().substring(0, 25) + "..."); */
  let rowEntry = dataBuffer.split(/\r?\n/);
  return rowEntry.reduce((result, innerRow) => {
    let components = innerRow.split('\t');
    if(components.length > 1 && components[0] !== "Adapter/Port"){
      //create the object of the adapter to return
      return result.concat({
        adapterDetail: components[0],
        name: components[1],
        address: components[2],
        description: components[3]
      });
    }
    return result;
  }, []);
}
