import moment from "moment";

/**
 * Return an array of log entry that have a temperature between min and max
 * @param data
 * @param minTmp
 * @param maxTmp
 * @returns {*[]|number}
 */
export function filterByTmpRange(data, minTmp, maxTmp){
  let renderedSamples = [];
  if(typeof data === 'undefined') return 0;
  Object.keys(data).forEach(i =>
  {
    renderedSamples[i] = Object.values(data[i]).filter( value => value > minTmp && value < maxTmp);

  });

  return renderedSamples;
}

/**
 * calculate daily median usage
 * @param filteredDailyAverage
 * @returns {{}}
 */
export function dailyMedian(filteredDailyAverage){
  const logDataDaily = {};
  for(let i in filteredDailyAverage){
    const dailyMedian = Object.entries(filteredDailyAverage[i])[0];
    let m = moment(dailyMedian[0], "YYYY-MM-DD").get('month');
    let d = moment(dailyMedian[0], "YYYY-MM-DD").get('date');
    m = (m+1).toString();
    if(typeof logDataDaily[m] === 'undefined') {
      logDataDaily[m] = {};
    }
    logDataDaily[m][d] = dailyMedian[1];
  }

  return logDataDaily
}


/**
 * calculate the monthly median usage
 * @param filteredDailyAverage
 * @returns {{}}
 */
export function monthlyMedian(filteredDailyAverage){

  let monthlyMedian = {};
  let monthlyCount = {};

  for(let i in filteredDailyAverage){
    const dailyMedian = Object.entries(filteredDailyAverage[i])[0];
    //console.log(i);
    let m = moment(dailyMedian[0], "YYYY-MM-DD").get('month');
    m = (m+1).toString();
    if(typeof monthlyMedian[m] === 'undefined') {
      monthlyMedian[m] = 0;
      monthlyCount[m] = 0;
    }
    monthlyMedian[m] += dailyMedian[1];
    monthlyCount[m] += 1;
  }

  Object.keys(monthlyMedian).forEach( d => {
    monthlyMedian[d] = monthlyMedian[d]/ monthlyCount[d]
  })
  return monthlyMedian;
}

/**
 * generic function to calculate average from an array of number
 * @param data
 * @returns {number}
 */
export function calculateAverage(data){
  return Object.values(data).reduce((a,b) => a + b, 0) / Object.keys(data).length
}
