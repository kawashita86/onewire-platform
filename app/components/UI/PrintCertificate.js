import React, { Component } from 'react';
import {convertDate} from "../../utils/iButtonManager";
import {calculateAverage, calculateDailyAverage} from "../../utils/analyzeData";

export default class PrintCertificate extends Component {

  render() {


    const {mission, thermocron} = this.props;

    const startDate = convertDate(thermocron.lastMissionStarted, true)
    const endDate = convertDate(thermocron.realTimeClockValue, true)

  //  const dailyAverage = calculateDailyAverage(thermocron.parsedLog, thermocron.minTmp, thermocron.maxTmp, mission.tempoUtilizzo);
  //  const percentageUsage = Math.round(calculateAverage(dailyAverage)*100);
    const percentageUsage = 0;

    return (
      <>
        <h1 style={{backgroundColor: "black", fontSize: 25}}className="nomePaziente">{mission.nomePaziente}</h1>
        <h3 className="dataFrom" >{startDate}</h3>
        <h3 className="dataTo">{endDate}</h3 >
        <p className = "tempoUtilizzo" >{mission.tempoUtilizzo}</p>
        <p>
          <span className="imgUtilizzo">{percentageUsage}</span>
        </p>
      </>
    )
  }
}
