import React, { Component } from 'react';

export default class PrintCertificate extends Component {

  render() {
    return (
      <>
        <h1 className="nomePaziente">{mission.nomePaziente}</h1>
        <h3 className = "dataFrom" > '+startDate+' </h3>
        <h3 className="dataTo">{endDate}</h3 >
        <p className = "tempoUtilizzo" >{mission.tempoUtilizzo}</p>
        <p>
          <span className="imgUtilizzo">{percentageUsage}</span>
        </p>
      </>
    )
  }
}
