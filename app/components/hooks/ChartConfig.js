import React from 'react'
//

const options = {
  elementType: ['line', 'area', 'bar', 'bubble'],
  primaryAxisType: ['linear', 'time', 'log', 'ordinal'],
  secondaryAxisType: ['linear', 'time', 'log', 'ordinal'],
  primaryAxisPosition: ['top', 'left', 'right', 'bottom'],
  secondaryAxisPosition: ['top', 'left', 'right', 'bottom'],
  secondaryAxisStack: [true, false],
  primaryAxisShow: [true, false],
  secondaryAxisShow: [true, false],
  grouping: ['single', 'series', 'primary', 'secondary'],
  tooltipAnchor: [
    'closest',
    'top',
    'bottom',
    'left',
    'right',
    'center',
    'gridTop',
    'gridBottom',
    'gridLeft',
    'gridRight',
    'gridCenter',
    'pointer'
  ],
  tooltipAlign: [
    'auto',
    'top',
    'bottom',
    'left',
    'right',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
    'center'
  ],
  snapCursor: [true, false]
}


export default function useChartConfig({
                                         series,
                                         count = 1,
                                         resizable = true,
                                         canRandomize = true,
                                         dataType = 'time',
                                         elementType = 'line',
                                         primaryAxisType = 'linear',
                                         secondaryAxisType = 'linear',
                                         primaryAxisPosition = 'bottom',
                                         secondaryAxisPosition = 'left',
                                         primaryAxisStack = false,
                                         secondaryAxisStack = true,
                                         primaryAxisShow = true,
                                         secondaryAxisShow = true,
                                         tooltipAnchor = 'closest',
                                         tooltipAlign = 'auto',
                                         grouping = 'primary',
                                         snapCursor = true,
                                         datums = 31
                                       }) {
  const [state, setState] = React.useState({
    count,
    resizable,
    canRandomize,
    dataType,
    elementType,
    primaryAxisType,
    secondaryAxisType,
    primaryAxisPosition,
    secondaryAxisPosition,
    primaryAxisStack,
    secondaryAxisStack,
    primaryAxisShow,
    secondaryAxisShow,
    tooltipAnchor,
    tooltipAlign,
    grouping,
    snapCursor,
    datums,
    data: makeDataFrom(dataType, datums, series)
  })

  React.useEffect(() => {
    setState(old => ({
      ...old,
      data: makeDataFrom(dataType,  datums, series)
    }))
  }, [count, dataType, datums, series])


  return {
    ...state

  }
}

function makeDataFrom(dataType, datums, series) {
  return Object.entries(series).map((d) => makeSeries(d, datums))
}

function makeSeries(d,  datums) {
  const months = {1: "Gen", 2 : "Feb",  3 : "Mar", 4: "Apr", 5: "May",6 : "Jun",7: "Jul",8: "Aug",9: "Set",10: "Ott",11: "Nov",0: "Dec"};
  return {
    label: months[d[0]],
    datums:[...new Array(datums)].map((_, t) => {
      let x =  t;
      const y = typeof d[1][t] !== "undefined" ? d[1][t] : null;
       return {
         x,
         y,
         undefined
       }
    })
  }
}
