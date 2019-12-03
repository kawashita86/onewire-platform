import React, { Component } from 'react';
import Pagina from '../components/Pagina';
import {bindActionCreators} from "redux";
import * as CounterActions from "../actions/counter";
import * as ThermocronActions from "../actions/thermocron";
import * as MissionActions from "../actions/mission";
import {connect} from "react-redux";


function mapStateToProps(state) {
  return {
    counter: state.counter,
    thermocron: state.thermocron,
    mission: state.mission
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...CounterActions,
      ...ThermocronActions,
      ...MissionActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagina);
