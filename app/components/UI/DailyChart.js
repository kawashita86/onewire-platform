import React from 'react'
import useChartConfig from '../hooks/ChartConfig'
import { Chart } from 'react-charts'
import ResizableBox from "./ResizableBox";

export default (props) => {

  const {
    data,
    primaryAxisShow,
    secondaryAxisShow,
  } = useChartConfig({
    series: props.data,
    dataType: 'linear',
    show: ['primaryAxisShow', 'secondaryAxisShow']
  })

  const axes = React.useMemo(
    () => [
      {
        primary: true,
        position: 'bottom',
        type: 'linear',
        show: primaryAxisShow,
        hardMax: 31,
        min: 1
      },
      { position: 'left', type: 'linear', show: secondaryAxisShow, hardMax: 24, min: 0 }
    ],
    [primaryAxisShow, secondaryAxisShow]
  )
  return (
      <ResizableBox>
        <Chart data={data} axes={axes} tooltip />
      </ResizableBox>
  )
}
