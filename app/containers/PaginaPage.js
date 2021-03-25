import React, { Component } from 'react';
import Pagina from '../components/Pagina';
import {bindActionCreators} from "redux";
import * as ThermocronActions from "../actions/thermocron";
import * as MissionActions from "../actions/mission";
import * as AppActions from "../actions/app";
import {connect} from "react-redux";


function mapStateToProps(state) {
  return {
    thermocron: state.thermocron,
    mission: state.mission,
    errors: state.errors,
    app: state.app
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...ThermocronActions,
      ...MissionActions,
      ...AppActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagina);
