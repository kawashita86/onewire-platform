// @flow
import React, {Component} from 'react';
import styles from './Pagina.css';
import {Link} from "react-router-dom";
import routes from '../constants/routes';
import {Button, Form, FormGroup, Label, Input, } from 'reactstrap';
import {printRawHtml, savePDF} from "../utils/printPDF";
import {convertDate} from "../utils/iButtonManager";
import {
  calculateAverage,
  filterByTmpRange,
  monthlyMedian
} from "../utils/analyzeData";
import {Spinner} from "./UI/Spinner";
import DeviceList from "./DeviceList";
import Header from "./UI/Header";
import {TYPE_DEVICE_LIST, TYPE_READ_MISSION, TYPE_WRITE_MISSION} from "../reducers/async";

const smalltalk = require('smalltalk');

export default class Pagina extends Component {
  myFormRef = null

  constructor(props) {
    super(props);
  }

  startMission(e) {
    e.preventDefault();
    //check for error in field name/tempo impiego to set error message
    const {mission} = this.props;
    if (this.props.loading !== null)
      return false;

    if (mission.nomePaziente.length === 0 || mission.tempoUtilizzo.length === 0) {
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
        this.props.writeMissionData();
      }).catch(() => {
      return false;
    });
    return false;
  }

  stopMission(e) {
    e.preventDefault();
    if (this.props.loading !== null)
      return false;
    this.myFormRef.reset();
    this.props.readMissionData();
    return false;
  }

  updateAnagrafica(e) {
    e.preventDefault();
    const {thermocron} = this.props;
    if (typeof thermocron.lastMissionStarted === 'undefined' || !thermocron.lastMissionStarted || Object.keys(thermocron.parsedLog).length === 0) {
      smalltalk.alert("Aggiorna Anagrafica", "Impossibile procedere con la stampa è necessario terminare la mission prima");
      return false;
    }
    this.props.updateAnagrafica();
    return false;
  }

  preparePrint(isDownload = false) {
    const {mission, thermocron} = this.props;
    if (typeof thermocron.lastMissionStarted === 'undefined' || !thermocron.lastMissionStarted || Object.keys(thermocron.parsedLog).length === 0) {
      smalltalk.alert("Print Certificate", "Impossibile procedere con la stampa è necessario terminare la mission prima");
      return false;
    }

    const filteredData = filterByTmpRange(this.props.thermocron.parsedLog, this.props.thermocron.minTmp, this.props.thermocron.maxTmp);
    const filteredDailyAverage = Object.keys(filteredData).map(x => {return { [x]: filteredData[x].length}});
    const dailyCount = Object.keys(filteredData).map(x => filteredData[x].length);
    const percentageUsage = Math.round((calculateAverage(Object.values(dailyCount)) / this.props.mission.tempoUtilizzo) * 100);
    const hourUsage = parseFloat(calculateAverage(Object.keys(filteredData).map(x => filteredData[x].length))).toFixed(1);
    let startDate = convertDate(thermocron.lastMissionStarted, true)
    let endDate = convertDate(thermocron.realTimeClockValue, true);
    const logData = monthlyMedian(filteredDailyAverage);

    const chartData = Object.keys(logData).map((index) => logData[index]);

    const chartLabels = Object.keys(logData).map((index) => index);
    let [name, lastname] = mission.nomePaziente.split(' ');
    if(typeof lastname === 'undefined'){
      lastname = '';
    }
    console.log(chartData, chartLabels);
    //human readable format
    startDate = new Date(Date.parse(startDate.replace(/[-]/g,'/'))).toLocaleDateString()
    endDate = new Date(Date.parse(endDate.replace(/[-]/g,'/'))).toLocaleDateString()

    if(isDownload){
      savePDF(
        mission.nomePaziente,
        '<h3 class="datePrint">' + (new Date()).toLocaleDateString() + '</h3><h1 class="nomePaziente">' + name + '</h1><h1 class="cognomePaziente">' + lastname + '</h1>' +
        '<h3 class="dataFrom">' + startDate + '</h3><h3 class="dataTo">' + endDate + '</h3><p class="tempoUtilizzo">' + mission.tempoUtilizzo + '</p>' +
        '<p><span class="imgUtilizzo">' + percentageUsage + '<span style="font-size:15pt">%</span>' +
        //'<span style="font-size:10px;clear: both;display: block;position: absolute;top: 22px;left: 16px;">media totale</span>' +
        '</span></p>' +
        '<p><span class="imgMediaOraria">' + hourUsage+ '<span style="font-size:15pt">ore</span>' +
        //'<span style="font-size:10px;clear: both;display: block;position: absolute;top: 22px;left: 22px;">ore al giorno</span>' +
        '</span></p>',
        chartData,
        chartLabels
      ).then(data => console.log('downloaded', data))
    } else {

      printRawHtml(
        '<h3 class="datePrint">' + (new Date()).toLocaleDateString() + '</h3><h1 class="nomePaziente">' + name + '</h1><h1 class="cognomePaziente">' + lastname + '</h1>' +
        '<h3 class="dataFrom">' + startDate + '</h3><h3 class="dataTo">' + endDate + '</h3><p class="tempoUtilizzo">' + mission.tempoUtilizzo + '</p>' +
        '<p><span class="imgUtilizzo">' + percentageUsage + '<span style="font-size:15pt">%</span>' +
        //'<span style="font-size:10px;clear: both;display: block;position: absolute;top: 22px;left: 16px;">media totale</span>' +
        '</span></p>' +
        '<p><span class="imgMediaOraria">' + hourUsage + '<span style="font-size:15pt">ore</span>' +
        //'<span style="font-size:10px;clear: both;display: block;position: absolute;top: 22px;left: 22px;">ore al giorno</span>' +
        '</span></p>',
        chartData,
        chartLabels
      ).then(data => console.log('printed'))
    }
  }

  componentDidMount() {
    //at the start we check if adapter connected and request for device list
    if (this.props.app.adapterConnected === true) {
      console.log('retrieveDeviceList');
      this.props.retrieveDeviceList();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.app.adapterConnected === true && prevProps.app.adapterConnected === false) {
      console.log('retrieveDeviceList');
      this.props.retrieveDeviceList();
    }
  }

  render() {
    const {thermocron, setNomePaziente, mission, setTempoUtilizzo} = this.props;
    let startDate = '', endDate = '';

    if (typeof thermocron.lastMissionStarted !== 'undefined' && thermocron.lastMissionStarted) {
      startDate = convertDate(thermocron.lastMissionStarted, true)
    }

    if (typeof thermocron.realTimeClockValue !== 'undefined' && thermocron.realTimeClockValue) {
      endDate = convertDate(thermocron.realTimeClockValue, true)
    }

    return (
      <>
        <Header/>
        <div className={'container'} data-tid="container">

          <div className="container" style={{width: '450px'}}>

            <div className="row">
              <DeviceList
                loading={this.props.loading === TYPE_DEVICE_LIST}
                loaded={this.props.loaded === TYPE_DEVICE_LIST}
                selectedDevice={this.props.app.selectedDevice}
                selectDevice={this.props.selectDevice}
                deviceList={this.props.app.deviceList}
                retrieveDeviceList={this.props.retrieveDeviceList}/>
            </div>

            <Form innerRef={(el) => this.myFormRef = el}>
              <FormGroup row>
                <Label for="datiPresidio">Dati paziente</Label>
                <div className="sd-container">
                <Input type="text" name="name" id="datiPaziente" placeholder="Nome e cognome"
                       onChange={e => setNomePaziente(e.target.value)} value={mission.nomePaziente}/>
                <span className="open-button-large">
                  <button type="button" onClick={e => this.updateAnagrafica(e)}>Salva dati</button>
                </span>
                </div>
              </FormGroup>

              <FormGroup row>
                <Label for="tempoUtilizzo">Tempo impiego presidio </Label>
                <Input type="number" name="time" id="tempoUtilizzo" placeholder="Tempo utilizzo"
                       onChange={e => setTempoUtilizzo(e.target.value)} value={mission.tempoUtilizzo}/>
              </FormGroup>

              <div className="row">
                <div className="col-sm text-center">
                  <button className={`${styles.startStop} btn-success`}
                          data-tclass="startStop" onClick={(e) => this.startMission(e)}>
                    {this.props.loading === TYPE_WRITE_MISSION ? <>
                      <Spinner/> Loading</> : 'Start'}</button>
                </div>
                <div className="col-sm text-center">
                  <button className={`${styles.startStop} ${styles.stopButton} btn-danger`}
                          data-tclass="startStop" onClick={(e) => this.stopMission(e)}>
                    {this.props.loading === TYPE_READ_MISSION ? <>
                      <Spinner/> Loading</> : 'Read'} </button>
                </div>
              </div>

              <FormGroup style={{display: 'inline-block', width: '50%'}}>
                <Label for="dataInizio">Data inizio</Label>
                <div className="sd-container">
                  <Input type="date" name="dataInizio" id="dataInizio" placeholder="Data inizio"
                         defaultValue={startDate}/>
                  <span className="open-button">
                    <button type="button">📅</button>
                  </span>
                </div>
              </FormGroup>

              <FormGroup style={{display: 'inline-block', width: '50%'}}>
                <Label for="dataFine">Data fine</Label>
                <div className="sd-container">
                  <Input type="date" name="dataFine" id="dataFine" placeholder="Data fine"
                         defaultValue={endDate}/>
                  <span className="open-button">
                    <button type="button">📅</button>
                  </span>
                </div>
              </FormGroup>
            </Form>

            <div className="row">
              <div className="col-sm text-center">
                <Link to={routes.PAGINANEW}
                      className={`${styles.bottoniFondoPaginaLink} btn btn-success`}
                      data-tclass="mediaGiornaliera">
                  Report</Link>
                <Button className={`${styles.bottoniFondoPagina} btn btn-success`}
                        onClick={() => this.preparePrint()}
                        data-tclass="print">
                  Stampa</Button>
                <Button className={`${styles.bottoniFondoPagina} btn btn-success`}
                        onClick={() => this.preparePrint(true)}
                        data-tclass="print">
                  Download</Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
