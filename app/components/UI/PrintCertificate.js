import React, { Component } from 'react';
import {convertDate} from "../../utils/iButtonManager";

export default class PrintCertificate extends Component {

  render() {


    const {mission, thermocron} = this.props;

    const startDate = convertDate(thermocron.lastMissionStarted, true)
    const endDate = convertDate(thermocron.realTimeClockValue, true)

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
