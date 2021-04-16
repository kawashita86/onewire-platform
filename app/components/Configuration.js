import React, {Component} from "react";
import Header from "./UI/Header";
import {Button, Col, Form, FormGroup, Input, Label} from "reactstrap";
import {Link} from "react-router-dom";
import routes from "../constants/routes.json";


export default class Configuration extends Component {

  constructor(props) {
    super(props);
    this.updateInput = this.updateInput.bind(this);
    this.saveConfiguration = this.saveConfiguration.bind(this);
  }

  saveConfiguration(){
    this.props.saveConfiguration({
      minTmp: this.props.thermocron.tmpMinTmp,
      maxTmp: this.props.thermocron.tmpMaxTmp
    });
  }

  updateInput(value, name){
    this.props.setTemperatura({name, value});
  }

  render() {

    return (
      <>
        <Header/>
        <div className={'container'} data-tid="container">
          <Link to={routes.HOME} className="go-back-link">
            <i className="fa fa-arrow-left fa-3x"/>
          </Link>
          <div className="container" style={{width:'400px'}}>
              <Form>
                <FormGroup row>
                  <Label for="dataInizio">Temperatura Min</Label>
                  <Col sm={12}>
                    <Input type="number" name="minTmp" id="minTmp" onChange={(e) => this.updateInput(e.target.value, 'MinTmp')}
                          value={this.props.thermocron.tmpMinTmp} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="dataFine">Data fine</Label>
                  <Col sm={12}>
                    <Input type="number" name="maxTmp" id="maxTmp" onChange={(e) => this.updateInput(e.target.value, 'MaxTmp')}
                           value={this.props.thermocron.tmpMaxTmp}    />
                  </Col>
                </FormGroup>
                <Button className="btn btn-success" onClick={this.saveConfiguration}>Salva</Button>
              </Form>
          </div>
        </div>
      </>
    );
  }
}
