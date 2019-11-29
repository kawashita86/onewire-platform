// @flow
import React, { Component } from 'react';
import styles from './Pagina.css';
import { Link } from "react-router-dom";
import routes from '../constants/routes';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

export default class Pagina extends Component {
  render() {
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
                  <Label for="tempoUtilizzo">Tempo impiegato presidio</Label>
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
            <button className={styles.startStop}
                    data-tclass="startStop">
              Start<br/>Stop </button>
          </div>
          <div className="col-sm">
            <Form>
              <FormGroup>
                <Label for="dataInizio">Data inizio</Label>
                <Input type="text" name="dataInizio" id="dataInizio" placeholder="Data inizio" />
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
              <Button color={'success'} className={styles.bottoniFondoPagina}
                      data-tclass="mediaGiornaliera"><Link to={routes.PAGINANEW}>
                Media<br/>giornaliera </Link></Button>
              <Button color={'success'} className={styles.bottoniFondoPagina}
                      data-tclass="mediaMensile">
                Media<br/>mensile </Button>
              <Button color={'success'} className={styles.bottoniFondoPagina}
                      data-tclass="calendario">
                Calendario </Button>
            </div>
          </div>
      </div>


      </div>
    );
  }
}
