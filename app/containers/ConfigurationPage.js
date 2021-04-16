import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Configuration from "../components/Configuration";
import {saveConfiguration} from "../actions/app";
import {setTemperatura} from "../actions/thermocron";
import {STATUS_LOADED, TYPE_CONFIGURATION} from "../reducers/async";

function mapStateToProps(state) {
  return {
    thermocron: state.thermocron,
    errors: state.errors,
    app: state.app,
    loaded: state.asyncManager.type === TYPE_CONFIGURATION && state.asyncManager.status === STATUS_LOADED
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      saveConfiguration,
      setTemperatura
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
