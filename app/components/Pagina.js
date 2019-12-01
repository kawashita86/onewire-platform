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
      <div className={'container'} data-tid="container">
        <Link to={routes.HOME}>
          <i className="fa fa-arrow-left fa-3x" />
        </Link>
        <div className="container">

          <div className="row">
            <div className="col-sm">
              <Form>
                <FormGroup>
                  <Label for="datiPresidio">Dati presidio</Label>
                  <Input type="text" name="name" id="datiPresidio" placeholder="Nome e cognome" />
                </FormGroup>
              </Form>
            </div>
            <div className="col-sm">
            </div>
            <div className="col-sm">
            </div>
          </div>

          <div className="row">
            <div className="col-sm">
              <Form>
                <FormGroup>
                  <Label for="tempoUtilizzo">Tempo impiego presidio</Label>
                  <Input type="text" name="time" id="tempoUtilizzo" placeholder="Tempo utilizzo" />
                </FormGroup>
              </Form>
            </div>
            <div className="col-sm">
            </div>
            <div className="col-sm">
            </div>
          </div>

        <div className="row">
          <div className="col-sm">
            <button className={`${styles.startStop} btn-success`}
                    data-tclass="startStop" onClick={() => writeMissionData()}>
              Start</button>
            <button className={`${styles.startStop} ${styles.stopButton} btn-danger`}
                                                data-tclass="startStop" onClick={() => readMissionData()}>
            Stop </button>
            <button className={`${styles.startStop} ${styles.stopButton} btn-danger`}
                    data-tclass="startStop" onClick={() => print()}>
              Print </button>
            <button className={`${styles.startStop} ${styles.stopButton} btn-danger`}
                    data-tclass="startStop" onClick={() => savePDF()}>
              Print </button>
          </div>
          <div className="col-sm">
            <Form>
              <FormGroup>
                <Label for="dataInizio">Data inizio</Label>
                <Input type="text" name="dataInizio" id="dataInizio" placeholder="Data inizio" value={startDate}/>
              </FormGroup>
            </Form>
          </div>
          <div className="col-sm">
            <Form>
              <FormGroup>
                <Label for="dataFine">Data fine</Label>
                <Input type="text" name="dataFine" id="dataFine" placeholder="Data fine" />
              </FormGroup>
            </Form>
          </div>
        </div>

          <div className="row">
            <div className="col-12">
              <Link to={routes.PAGINANEW} className={`${styles.bottoniFondoPagina} btn btn-success`} data-tclass="mediaGiornaliera">
                Media<br/>giornaliera </Link>
              <Link to={routes.PAGINANEW} className={`${styles.bottoniFondoPagina} btn btn-success`}
                      data-tclass="mediaMensile">
                Media<br/>mensile </Link>
              <Link to={routes.PAGINANEW} className={`${styles.bottoniFondoPagina} btn btn-success`}
                      data-tclass="calendario">
                Calendario </Link>
            </div>
          </div>
      </div>


      </div>
    );
  }
}
