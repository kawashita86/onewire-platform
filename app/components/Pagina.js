// @flow
import React, { Component } from 'react';
import styles from './Pagina.css';
import { Link } from "react-router-dom";
import routes from '../constants/routes';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {printRawHtml} from "../utils/printPDF";
import {convertDate} from "../utils/iButtonManager";

export default class Pagina extends Component {
   state = {
     missionState: false,
     loadingWriteData: false,
     loadingReadData: false
   }



   startMission(){
     this.setState({
       loadingWriteData: true
     }, this.props.writeMissionData);

   }

   stopMission(){
     this.setState({
       loadingReadData: true
     }, this.props.readMissionData);
   }

   shouldComponentUpdate(nextProps, nextState, nextContext) {
     if((typeof (this.props.thermocron.realTimeClockValue) === 'undefined' &&
       typeof nextProps.thermocron.realTimeClockValue !== 'undefined') ||
       (typeof (this.props.thermocron.realTimeClockValue) !== 'undefined' &&
         typeof nextProps.thermocron.realTimeClockValue === 'undefined') ||
       (this.props.thermocron.realTimeClockValue !== nextProps.thermocron.realTimeClockValue)){
       nextState.loadingWriteData = false;
       nextState.loadingReadData = false;
     }
     return true;
   }

  render() {
    const {thermocron, setNomePaziente, mission, setTempoUtilizzo} = this.props;
    let startDate = '', endDate = '';

    if(typeof thermocron.lastMissionStarted !== 'undefined' && thermocron.lastMissionStarted){
      startDate = convertDate(thermocron.lastMissionStarted, true)
    }

    if(typeof thermocron.realTimeClockValue !== 'undefined' && thermocron.realTimeClockValue){
      endDate = convertDate(thermocron.realTimeClockValue, true)
    }

    return (
      <>
        <h1 className={styles.titoloApp} data-tclass='titoloApp'>T.<img width='45px' height='55px' src={'../resources/Timon.png'}/>.Mon ©</h1>
        <h4 className={styles.titolettiPagine} data-tclass='titolettiPagine'>Thermo Index Monitoring</h4>

      <div className={'container'} data-tid="container">

        <div className="container" style={{width:'400px'}}>

          <div className="row">
              <Form>
                <FormGroup>
                  <Label for="datiPresidio">Dati paziente</Label>
                  <Input type="text" name="name" id="datiPaziente" placeholder="Nome e cognome" onChange={e => setNomePaziente(e.target.value)} value={mission.nomePaziente} />
                </FormGroup>
              </Form>
            </div>

          <div className="row">
            <Form>
              <FormGroup>
                <Label for="tempoUtilizzo">Tempo impiego presidio </Label>
                <Input type="text" name="time" id="tempoUtilizzo" placeholder="Tempo utilizzo" onChange={e => setTempoUtilizzo(e.target.value)} value={mission.tempoUtilizzo} />
              </FormGroup>
            </Form>
          </div>

        <div className="row">
          <div className="col-sm text-center">
            <button className={`${styles.startStop} btn-success`}
                    data-tclass="startStop" onClick={() => this.startMission()}>
              {this.state.loadingWriteData ? 'Loading': 'Start'}</button>
          </div>
          <div className="col-sm text-center">
            <button className={`${styles.startStop} ${styles.stopButton} btn-danger`}
                                                data-tclass="startStop" onClick={() => this.stopMission()}>
              {this.state.loadingReadData ? 'Loading': 'Stop'} </button>
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
            <div className="col-sm text-center">
              <Button className={`${styles.bottoniFondoPagina} btn btn-success`}><Link to={routes.PAGINANEW} data-tclass="mediaGiornaliera">
                Report</Link></Button>
              <Button className={`${styles.bottoniFondoPagina} btn btn-success`} onClick={() => printRawHtml(
                '<table><tr style="margin-bottom:10px"><th>T.I.Mon</th></tr><tr style="margin-bottom:10px"><td>Nome: '+mission.nomePaziente+'</td></tr><tr style="margin-bottom:10px"><td>Data inizio: '+startDate+' Data fine: '+endDate+'</td></tr><tr><td style="margin-bottom:10px">Tempo utilizzo 0 ore</td></tr></table>'
              )}
                    data-tclass="print">
                Stampa</Button>
            </div>
          </div>
      </div>
      </div>
        </>
    );
  }
}
