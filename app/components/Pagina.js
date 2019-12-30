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
const smalltalk = require('smalltalk');

export default class Pagina extends Component {
   state = {
     missionState: false,
     loadingWriteData: false,
     loadingReadData: false
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
     if(typeof thermocron.lastMissionStarted === 'undefined' || !thermocron.lastMissionStarted){
       smalltalk.alert("Print Certificate", "Impossibile procedere con la stampa è necessario terminare la mission prima");
       return false;
     }
    // const svgChart = "";
     const dailyAverage = calculateDailyAverage(this.props.thermocron.parsedLog, this.props.thermocron.minTmp, this.props.thermocron.maxTmp, this.props.mission.tempoUtilizzo);
     const percentageUsage = Math.round(calculateAverage(dailyAverage)*100);
     const startDate = convertDate(thermocron.lastMissionStarted, true)
     const endDate = convertDate(thermocron.realTimeClockValue, true)
     const logData = filterParsedByDateRange(this.props.thermocron.parsedLog, this.props.thermocron.minTmp, this.props.thermocron.maxTmp);
     const months = {"01": "Gen", "02" : "Feb",  "03" : "Mar",Apr: "04",May: "05",Jun: "06",Jul: "07",Aug: "08",Sep: "09",Oct: "10",11: "Nov",Dec: "12"};
     const chartData = Object.keys(logData).map((index) => logData[index]*24);
     const chartLabels = Object.keys(logData).map((index) => months[index]);
  //   const charData = [['def',0], ...chartData];

     printRawHtml(
       '<h1 class="nomePaziente">'+mission.nomePaziente+'</h1><h3 class="dataFrom">'+startDate+'</h3><h3 class="dataTo">'+endDate+'</h3><p class="tempoUtilizzo">'+mission.tempoUtilizzo+'</p>' +
       '<p><span class="imgUtilizzo">'+percentageUsage+'</span></p>',
       chartData,
       chartLabels
     )
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
        <h1 className={styles.titoloApp} data-tclass='titoloApp'>T.<img width='45px' height='55px' src={ path.join(__dirname,'assets','Timon.png')}/>.Mon ©</h1>
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
