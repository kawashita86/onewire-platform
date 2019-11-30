import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Counter.css';
import routes from '../constants/routes';
//import { useTable } from 'react-table'
import ReactTable from "react-table";
import "react-table/react-table.css";
import Calendar from 'react-calendar';
import {Chart} from "react-charts";
import {filterByDateRange, filterByTmpRange} from "../utils/analyzeData";
import {clearMissionData} from "../actions/thermocron";


export default class Counter extends Component {
    state = {
      date: new Date(),
    }

  onChange = date => this.setState({ date })

  render() {
    const {
      readMissionData,
      writeMissionData,
      clearMissionData,
      thermocron
    } = this.props;

    const percentageUsage = (filterByTmpRange(thermocron.log, thermocron.minTmp, thermocron.maxTmp)/Object.keys(thermocron.log).length)*100
    const logData = filterByDateRange(thermocron.log, this.state.date[0], this.state.date[1]);
    const charData = logData.map((d, index) => [index, parseInt(d.value,10)]);
    const percentageUsageRange = (filterByTmpRange(logData, thermocron.minTmp, thermocron.maxTmp)/Object.keys(logData).length)*100


    const columns = [
      { key: 'id', name: 'ID' },
      { key: 'date', name: 'Data' },
      { key: 'value', name: 'Temperatura' } ];
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`counter ${styles.counter}`} data-tid="counter">
          {thermocron.deviceId}<br/>
          {percentageUsage}%<br/>
          {percentageUsageRange}%<br/>
        </div>
        {/*<ReactTable
          data={logData}
          filterable
          columns={[
            {
              columns: [
                {
                  Header: "Data",
                  accessor: "date",
                  filterMethod: (filter, row) =>
                  {
                    if(filter.value == 'all')
                      return true;
                     return row[filter.id].startsWith(filter.value)
                   },
                  Filter: ({ filter, onChange }) =>
                    <select
                      onChange={event => onChange(event.target.value)}
                      style={{ width: "100%" }}
                      value={filter ? filter.value : "all"}
                    >
                      <option value="all">Show All</option>
                      <option value="true">Can Drink</option>
                      <option value="false">Can't Drink</option>
                    </select>
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
        /> */}
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
          locale={"it"}
          selectRange={true}

        />

        <div className={styles.btnGroup}>
          <button className={styles.btn}
                  onClick={() => readMissionData()}
                  data-tclass="btn"
                  type="button"
          >
            read
          </button>
          <button className={styles.btn}
                  onClick={() => writeMissionData()}
                  data-tclass="btn"
                  type="button"
          >
            write
          </button>
          <button className={styles.btn}
                  onClick={() => clearMissionData()}
                  data-tclass="btn"
                  type="button"
          >
            clear
          </button>
        </div>
      </div>
    );
  }
}
