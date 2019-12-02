// @flow
import React, { Component } from 'react';
import styles from './Pagina.css';
import { Link } from "react-router-dom";
import routes from '../constants/routes';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {savePDF, print, printRawHtml} from "../utils/printPDF";
import {convertDate} from "../utils/iButtonManager";
import {calculateAverage, calculateDailyAverage} from "../utils/analyzeData";

export default class Pagina extends Component {
   state = {
     missionState: false,

   }

  render() {
    const {
      readMissionData,
      writeMissionData,
      thermocron,
      mission} = this.props;

    let dailyAverage = '';
    if(typeof thermocron.parsedLog !== 'undefined' && thermocron.parsedLog) {
      dailyAverage = calculateAverage(calculateDailyAverage(thermocron.parsedLog, thermocron.minTmp, thermocron.maxTmp))*24;
    }

    console.log(dailyAverage)

    let startDate = '';
    let endDate = '';

    if(typeof thermocron.lastMissionStarted !== 'undefined' && thermocron.lastMissionStarted){
      startDate = convertDate(thermocron.lastMissionStarted, true)
    }

    if(typeof thermocron.realTimeClockValue !== 'undefined' && thermocron.realTimeClockValue){
      endDate = convertDate(thermocron.realTimeClockValue, true)
    }

    return (
      <>
        <h1 className={styles.titoloApp} data-tclass='titoloApp'>T.I.Mon</h1>
        <h4 className={styles.titolettiPagine} data-tclass='titolettiPagine'>Thermo Index Monitoring</h4>

      <div className={'container'} data-tid="container">

        <div className="container" style={{width:'400px'}}>

          <div className="row">
              <Form>
                <FormGroup>
                  <Label for="datiPresidio">Dati paziente</Label>
                  <Input type="text" name="name" id="datiPaziente" placeholder="Nome e cognome" />
                </FormGroup>
              </Form>
            </div>

        <div className="row">
          <div className="col-sm text-center">
            <button className={`${styles.startStop} btn-success`}
                    data-tclass="startStop" onClick={() => writeMissionData()}>
              Start</button>
          </div>
          <div className="col-sm text-center">
            <button className={`${styles.startStop} ${styles.stopButton} btn-danger`}
                                                data-tclass="startStop" onClick={() => readMissionData()}>
            Stop </button>
          </div>
        </div>

          <div className="row">
            <Form>
              <FormGroup>
                <Label for="dataInizio">Data inizio</Label>
                <Input type="text" name="dataInizio" id="dataInizio" placeholder="Data inizio" defaultValue={startDate}/>
              </FormGroup>
            </Form>
          </div>

          <div className="row">
            <Form>
              <FormGroup>
                <Label for="dataFine">Data fine</Label>
                <Input type="text" name="dataFine" id="dataFine" placeholder="Data fine" defaultValue={endDate} />
              </FormGroup>
            </Form>
          </div>

          <div className="row">
            <Form>
              <FormGroup>
                <Label for="tempoUtilizzo">Tempo impiego presidio</Label>
                <Input type="text" name="time" id="tempoUtilizzo" placeholder="Tempo utilizzo" defaultValue={(dailyAverage === 'isNaN' ? '': dailyAverage.toString())} />
              </FormGroup>
            </Form>
          </div>

          <div className="row">
            <div className="col-sm text-center">
              <Link to={routes.PAGINANEW} className={`${styles.bottoniFondoPagina} btn btn-success`} data-tclass="mediaGiornaliera">
                Media<br/>giornaliera </Link>
              <Link to={routes.PAGINANEW} className={`${styles.bottoniFondoPagina} btn btn-success`}
                      data-tclass="mediaMensile">
                Media<br/>mensile </Link>
              <Link to={routes.PAGINANEW} className={`${styles.bottoniFondoPagina} btn btn-success`}
                      data-tclass="calendario">
                Calendario </Link>
              <Button to={routes.PAGINANEW} className={`${styles.bottoniFondoPagina} btn btn-success`} onClick={() => printRawHtml(
                '<table><tr style="margin-bottom:10px"><th>T.I.Mon</th></tr><tr style="margin-bottom:10px"><td>Nome: Prova paziente</td></tr><tr style="margin-bottom:10px"><td>Data inizio: '+startDate+' Data fine: '+endDate+'</td></tr><tr><td style="margin-bottom:10px">Tempo utilizzo '+dailyAverage+' ore</td></tr></table>'
              )}
                    data-tclass="print">
                Salva<br/>PDF</Button>
            </div>
          </div>
      </div>
      </div>
        </>
    );
  }
}
