import React from "react";
import styles from "./Pagina.css";
import Header from "./UI/Header";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";


export default class Configuration extends Component {



  render() {
    const {thermocron} = this.props;

    return (
      <>
        <Header/>
        <div className={'container'} data-tid="container">
          <div className="container" style={{width:'400px'}}>
            <div className="row">
              <Form>
                <FormGroup>
                  <Label for="dataInizio">Temperatura Min</Label>
                  <div className="sd-container">
                    <Input type="number" name="minTmp" id="minTmp" placeholder="" defaultValue={thermocron.minTmp}/>
                  </div>
                </FormGroup>
              </Form>
            </div>

            <div className="row">
              <Form>
                <FormGroup>
                  <Label for="dataFine">Data fine</Label>
                  <div className="sd-container">
                    <Input type="number" name="maxTmp" id="maxTmp" placeholder="Data fine" defaultValue={thermocron.maxTmp} />
                  </div>
                </FormGroup>
              </Form>
            </div>
            <div className="row">
              <Form>
                <Button className="btn btn-success">Salvas</Button>
              </Form>
            </div>
          </div>
        </div>
      </>
    );
  }
}
