import React, { Component } from 'react';
import PaginaNew from '../components/PaginaNew';
import {bindActionCreators} from "redux";
import * as ThermocronActions from "../actions/thermocron";
import {connect} from "react-redux";

function mapStateToProps(state) {
  return {
    thermocron: state.thermocron,
    mission: state.mission
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...ThermocronActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginaNew);
