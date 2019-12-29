import moment from "moment";

export function filterByTmpRange(data, minTmp, maxTmp){
  let renderedSamples = [];
  if(typeof data === 'undefined') return 0;
  Object.keys(data).forEach(i =>
  {
    renderedSamples[i] = Object.values(data[i]).filter( value => value > minTmp && value < maxTmp);

  });

  return renderedSamples;
}

export function calculateDailyAverage(data, minTmp, maxTmp){
  let dailyAverage = [];
  Object.keys(data).forEach(i =>
  {
    let validMetric = Object.values(data[i]).filter(value => value > minTmp && value < maxTmp);
    dailyAverage[i] = validMetric.length/Object.keys(data[i]).length;
  });

  return dailyAverage;
}

export function calculateAverage(data){
  return Object.values(data).reduce((a,b) => a + b, 0) / Object.keys(data).length
}

export function filterByDateRange(data, minDate, maxDate){
  let logData = [];
  if(typeof data === 'undefined') return logData;
  Object.keys(data).forEach((index) => {
    if(minDate === null && maxDate === null)
      logData.push({id: index,...data[index]})

    if(minDate !== null &&  minDate > data[index]['date'])
      return;

    if(maxDate !== null &&  maxDate < data[index]['date'])
      return;

    logData.push({id: index,...data[index]})

  })
  return logData;
}

export function filterParsedByDateRange(data, minTmp, maxTmp){
  let logData = [];
  if(typeof data === 'undefined') return logData;
  Object.keys(data).forEach((i) => {
    console.log(data[i]);
    let validMetric = Object.values(data[i]).filter(value => value > minTmp && value < maxTmp);
    console.log(validMetric);
    if(validMetric.length !== 0)
      logData[i] = validMetric.length/Object.keys(data[i]).length;
  });

  let monthlyMedian = {};
  let monthlyCount = {};

  for(let i in logData){
    //console.log(i);
    let m = moment(i).month();
    m = m.toString();
    if(typeof monthlyMedian[m] === 'undefined') {
      monthlyMedian[m] = 0;
      monthlyCount[m] = 0;
    }
    monthlyMedian[m] += logData[i];
    monthlyCount[m] += 1;
  }

  Object.keys(monthlyMedian).forEach( d => {
    monthlyMedian[d] = monthlyMedian[d]/ monthlyCount[d]
  })
  return monthlyMedian;
}


export function calculateDailyMedian(){
  if(typeof data === 'undefined') return logData;
  Object.keys(data).forEach((index) => {
    //calculate for each day how many time it has passed the min/max

  });
}