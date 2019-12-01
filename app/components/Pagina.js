// @flow
import React, { Component } from 'react';
import styles from './Pagina.css';
import { Link } from "react-router-dom";
import routes from '../constants/routes';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {savePDF, print} from "../utils/printPDF";
import {convertDate} from "../utils/iButtonManager";

export default class Pagina extends Component {
   state = {
     missionState: false,

   }

  render() {
    const {
      readMissionData,
      writeMissionData,
      thermoctron,
      mission} = this.props;

    let startDate = '';
    if(typeof thermoctron !== 'undefined' && thermoctron.lastMissionStarted.length !== 0){
      startDate = convertDate(thermoctron.lastMissionStarted)
    }

    return (
      <>
      <h4>Nome programma</h4>

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
                <Input type="text" name="dataInizio" id="dataInizio" placeholder="Data inizio" value={startDate}/>
              </FormGroup>
            </Form>
          </div>

          <div className="row">
            <Form>
              <FormGroup>
                <Label for="dataFine">Data fine</Label>
                <Input type="text" name="dataFine" id="dataFine" placeholder="Data fine" />
              </FormGroup>
            </Form>
          </div>

          <div className="row">
            <Form>
              <FormGroup>
                <Label for="tempoUtilizzo">Tempo impiego presidio</Label>
                <Input type="text" name="time" id="tempoUtilizzo" placeholder="Tempo utilizzo" />
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
              <Link to={routes.PAGINANEW} className={`${styles.bottoniFondoPagina} btn btn-success`} onClick={() => savePDF()}
                    data-tclass="print">
                Salva<br/>PDF</Link>
            </div>
          </div>
      </div>
      </div>
        </>
    );
  }
}
