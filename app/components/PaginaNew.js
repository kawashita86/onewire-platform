// @flow
import React, { Component, useState } from 'react';
import styles from './PaginaNew.css';
import { Link } from "react-router-dom";
import routes from '../constants/routes';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import classnames from 'classnames';
import Calendar from "react-calendar";
import {Chart} from "react-charts";
import {calculateAverage, calculateDailyAverage, filterByDateRange, filterByTmpRange} from "../utils/analyzeData";
import ReactTable from "react-table";
import moment from "moment";

export default class PaginaNew extends Component {

  state = {
    activeTab: '1',
    date: new Date(),
    formattedDate: false,
    logData: [],
    percentageUsage: 0,
    chartData: []
  }

  changeDate = (date) => {
    console.log('setChoosenDate', date);
    this.setState({date: date})
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) this.setState({activeTab: tab});
  }

  componentWillMount() {
    if(this.props.thermocron){
      const dailyAverage = calculateDailyAverage(this.props.thermocron.parsedLog, this.props.thermocron.minTmp, this.props.thermocron.maxTmp);
      const logData = filterByDateRange(this.props.thermocron.log, this.state.date[0], this.state.date[1]);
      this.setState({
        percentageUsage: Math.round(calculateAverage(dailyAverage)*100),
        logData: logData,
        charData: logData.map((d, index) => [index, parseInt(d.value, 10)])
      });
    }

  }

  render() {
    const {thermocron} = this.props;

    const getKey = (data) => {
      for (var objProp in data)
        if (data.propertyIsEnumerable(objProp)) {
          return new Date(objProp);
        }
    }

    const getLastKey = (data) => {
      var keys = Object.keys(data);
      var last = keys[keys.length - 1];
      return new Date(last);
    }

    let formattedDate = false;
    if(this.state.date !== null)
      formattedDate = moment(this.state.date[0]).format('Y-MM-DD');

    console.log(formattedDate);

    return (
      <div className={'container'} data-tid="container">
        <Link to={routes.HOME}>
          <i className="fa fa-arrow-left fa-3x"/>
        </Link>
        <div className="container">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({active: this.state.activeTab === '1'})}
                onClick={() => {
                  this.toggle('1');
                }}
              >
                Media giornaliera
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({active: this.state.activeTab === '2'})}
                onClick={() => {
                  this.toggle('2');
                }}
              >
                Resoconto mensile
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({active: this.state.activeTab === '3'})}
                onClick={() => {
                  this.toggle('3');
                }}
              >
                Calendario
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12" className={'text-center'}>
                  <h4 className={styles.titolettiPagine} data-tclass='titolettiPagine'>Media giornaliera</h4>
                  <span className={styles.bottonePercentuale}
                        data-tclass="bottonePercentuale">{this.state.percentageUsage}%</span>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  <h4>Grafico media mensile</h4>
                  {this.state.activeTab === '2' &&
                  <div
                    style={{
                      width: '400px',
                      height: '300px'
                    }}
                  >
                    <Chart
                      data={[
                        {
                          label: 'Series',
                          data: this.state.charData
                        }
                      ]}
                      axes={[
                        {primary: true, type: 'linear', position: 'bottom'},
                        {type: 'linear', position: 'left'}
                      ]}/>
                  </div>
                  }
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="3">
              <Row>
                <Col sm="12">
                  <h4>Calendario con link ai giorni</h4>
                  <Calendar
                    defaultActiveStartDate={getKey(thermocron.parsedLog)}
                    minDate={getKey(thermocron.parsedLog)}
                    maxDate={getLastKey(thermocron.parsedLog)}
                    onChange={this.changeDate}
                    value={this.state.date}
                    locale={"it"}
                    selectRange={true}

                  />
                  {formattedDate && typeof thermocron.parsedLog[formattedDate] !== 'undefined' &&
                  <ReactTable
                    data={thermocron.parsedLog[formattedDate].map((d,i) => {return {date : i, value : d}})}
                    filterable
                    columns={[
                      {
                        columns: [
                          {
                            Header: "Data",
                            accessor: "date",
                            filterMethod: (filter, row) => {
                              if (filter.value == 'all')
                                return true;
                              return row[filter.id].startsWith(filter.value)
                            },
                          },
                          {
                            Header: "Temperatura",
                            accessor: "value"
                          }
                        ]
                      },
                    ]}
                    defaultSorted={[
                      {
                        id: "age",
                        desc: true
                      }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                  />
                  }
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>


      </div>
    );
  }
}
