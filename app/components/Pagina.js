// @flow
import path from 'path';
import React, { Component } from 'react';
import styles from './Pagina.css';
import { Link } from "react-router-dom";
import routes from '../constants/routes';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {printRawHtml} from "../utils/printPDF";
import {convertDate} from "../utils/iButtonManager";
import {calculateAverage, calculateDailyAverage, filterParsedByDateRange} from "../utils/analyzeData";
import {Spinner} from "./UI/Spinner";
//import PrintCertificate from "./UI/PrintCertificate";
const smalltalk = require('smalltalk');

export default class Pagina extends Component {



   constructor(props) {
     super(props);
     this.state = {
       missionState: false,
       loadingWriteData: false,
       loadingReadData: false
     }

   }



   startMission(){
     //check for error in field name/tempo impiego to set error message
     const {mission} = this.props;
     if(mission.nomePaziente.length === 0 || mission.tempoUtilizzo.length === 0){
       //const alert = new Alert();
       smalltalk
         .alert('Errore', "E' necessario compilare i campi Nome Paziente e Tempo Utilizzo per cominciare una registrazione")
         .then(() => {
         });
       return false;
     }
     smalltalk
       .confirm('Cominciare Missione', 'Sei sicuro di voler cominciare la registrazione? Questo sovrascriverà tutti i dati presenti su iButton')
       .then(() => {
         this.setState({
           loadingWriteData: true
         }, this.props.writeMissionData);
       }).catch(() => {
       return false;
     });

   }

   stopMission(){
     this.setState({
       loadingReadData: true
     }, this.props.readMissionData);
   }

   preparePrint(){
     const {mission, thermocron} = this.props;
     if(typeof thermocron.lastMissionStarted === 'undefined' || !thermocron.lastMissionStarted || Object.keys(thermocron.parsedLog).length === 0){
       smalltalk.alert("Print Certificate", "Impossibile procedere con la stampa è necessario terminare la mission prima");
       return false;
     }
    // const svgChart = "";
     const dailyAverage = calculateDailyAverage(this.props.thermocron.parsedLog, this.props.thermocron.minTmp, this.props.thermocron.maxTmp, this.props.mission.tempoUtilizzo);
     const percentageUsage = Math.round(calculateAverage(dailyAverage)*100);
     const startDate = convertDate(thermocron.lastMissionStarted, true)
     const endDate = convertDate(thermocron.realTimeClockValue, true)
     const logData = filterParsedByDateRange(this.props.thermocron.parsedLog, this.props.thermocron.minTmp, this.props.thermocron.maxTmp);
     const months = {1: "Gen", 2 : "Feb",  3 : "Mar", 4: "Apr", 5: "May",6 : "Jun",7: "Jul",8: "Aug",9: "Set",10: "Ott",11: "Nov",0: "Dec"};
     const chartData = Object.keys(logData).map((index) => logData[index]*24);
     const chartLabels = Object.keys(logData).map((index) => months[index]);

     printRawHtml(
       '<h1 class="nomePaziente">'+mission.nomePaziente+'</h1><h3 class="dataFrom">'+startDate+'</h3><h3 class="dataTo">'+endDate+'</h3><p class="tempoUtilizzo">'+mission.tempoUtilizzo+'</p>' +
       '<p><span class="imgUtilizzo">'+percentageUsage+'</span></p>',
       chartData,
       chartLabels
     ).then(data => console.log('printed'))
   }


   shouldComponentUpdate(nextProps, nextState, nextContext) {
     if((typeof (this.props.thermocron.realTimeClockValue) === 'undefined' &&
       typeof nextProps.thermocron.realTimeClockValue !== 'undefined') ||
       (typeof (this.props.thermocron.realTimeClockValue) !== 'undefined' &&
         typeof nextProps.thermocron.realTimeClockValue === 'undefined') ||
       (this.props.thermocron.realTimeClockValue !== nextProps.thermocron.realTimeClockValue) ||
       (this.props.errors.length  === 0 && nextProps.errors.length !==0) ||
       (this.props.thermocron.deviceId === null &&
         nextProps.thermocron.deviceId !== null) ||
       (this.state.loadingReadData === true || this.state.loadingWriteData === true)
     ){
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
        <h1 className={styles.titoloApp} data-tclass='titoloApp'>T.<img width='45px' height='55px' src={ path.join(process.resourcesPath,'app','assets','Timon.png')}/>.Mon ©</h1>
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
              {this.state.loadingWriteData ? <><Spinner/> Loading</>: 'Start'}</button>
          </div>
          <div className="col-sm text-center">
            <button className={`${styles.startStop} ${styles.stopButton} btn-danger`}
                                                data-tclass="startStop" onClick={() => this.stopMission()}>
              {this.state.loadingReadData ? <><Spinner/> Loading</>: 'Stop'} </button>
          </div>
        </div>

          <div className="row">
            <Form>
              <FormGroup>
                <Label for="dataInizio">Data inizio</Label>
                <div className="sd-container">
                  <Input type="date" name="dataInizio" id="dataInizio" placeholder="Data inizio" defaultValue={startDate}/>
                  <span className="open-button">
                    <button type="button">📅</button>
                  </span>
                </div>
              </FormGroup>
            </Form>
          </div>

          <div className="row">
            <Form>
              <FormGroup>
                <Label for="dataFine">Data fine</Label>
                <div className="sd-container">
                  <Input type="date" name="dataFine" id="dataFine" placeholder="Data fine" defaultValue={endDate} />
                  <span className="open-button">
                    <button type="button">📅</button>
                  </span>
                </div>
              </FormGroup>
            </Form>
          </div>

          <div className="row">
            <div className="col-sm text-center">
              <Link to={routes.PAGINANEW}  className={`${styles.bottoniFondoPagina} btn btn-success`} style={{opacity: 1, lineHeight: '57px'}} data-tclass="mediaGiornaliera">
                Report</Link>
              <Button className={`${styles.bottoniFondoPagina} btn btn-success`} onClick={() => this.preparePrint()}
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
