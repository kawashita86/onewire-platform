// @flow
import React, { Component, useState } from 'react';
import styles from './PaginaNew.css';
import { Link } from "react-router-dom";
import routes from '../constants/routes';
import { TabContent, TabPane, Nav, NavItem, NavLink,  Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Calendar from "react-calendar";
import {Chart} from "react-charts";
import {
  calculateAverage,
  calculateDailyAverage,
  filterParsedByDateRange
} from "../utils/analyzeData";
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
      const dailyAverage = calculateDailyAverage(this.props.thermocron.parsedLog, this.props.thermocron.minTmp, this.props.thermocron.maxTmp, this.props.mission.tempoUtilizzo);
      const logData = filterParsedByDateRange(this.props.thermocron.parsedLog, this.props.thermocron.minTmp, this.props.thermocron.maxTmp);
      const months = {"01": "Gen", "02" : "Feb",  "03" : "Mar",Apr: "04",May: "05",Jun: "06",Jul: "07",Aug: "08",Sep: "09",Oct: "10",11: "Nov",Dec: "12"};
      const chartData = Object.keys(logData).map((index) => [months[index], logData[index]*24]);

      //const logData = filterByDateRange(this.props.thermocron.log);
      this.setState({
        percentageUsage: Math.round(calculateAverage(dailyAverage)*100),
        logData: logData,
        charData: [['def',0], ...chartData]
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
    let tableData = [];
    if(this.state.date !== null && Object.keys(thermocron.parsedLog).length !== 0) {
      formattedDate = moment(this.state.date).format('Y-MM-DD');
      if(typeof thermocron.parsedLog[formattedDate] !== 'undefined') {
        Object.keys(thermocron.parsedLog[formattedDate]).forEach((i) => {
          tableData.push({date: i, value: thermocron.parsedLog[formattedDate][i]});
        });
      }
    }

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
                  <h4 className={styles.titolettiPagine} data-tclass='titolettiPagine'>Grafico media mensile</h4>
                  {this.state.activeTab === '2' &&
                  <div
                    style={{
                      width: '400px',
                      height: '300px'
                    }}
                  >
                    <Chart
                      series={{
                        type: 'bar'
                      }}
                      data={[
                        {
                          label: 'Series',
                          data: this.state.charData
                        }
                      ]}
                      axes={[
                        { primary: true, type: 'ordinal', position: 'bottom' },
                        { position: 'left', type: 'linear', stacked: false }
                      ]}/>
                  </div>
                  }
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="3">
              <Row>
                <Col sm="12">
                  <h4 className={styles.titolettiPagine} data-tclass='titolettiPagine'>Calendario</h4>
                  <Calendar
                    defaultActiveStartDate={getKey(thermocron.parsedLog)}
                    minDate={getKey(thermocron.parsedLog)}
                    maxDate={getLastKey(thermocron.parsedLog)}
                    onChange={this.changeDate}
                    value={this.state.date}
                    locale={"it"}

                  />
                  {formattedDate && tableData.length !== 0 &&
                  <ReactTable
                    data={tableData}
                    columns={[
                      {
                        columns: [
                          {
                            Header: "Data",
                            accessor: "date",
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
                        id: "date",
                        desc: false
                      }
                    ]}
                    defaultPageSize={10}
                    getTrProps={(state, rowInfo, column) => {
                      return {
                        style: {
                            background: rowInfo.row.value < 20 || rowInfo.row.value > 40 ? 'red': 'transparent'
                          }
                        }
                    }}
                    className="table table-striped"
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
