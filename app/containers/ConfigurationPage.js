import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Configuration from "../components/Configuration";
import {saveConfiguration} from "../actions/app";
import {setTemperatura} from "../actions/thermocron";

function mapStateToProps(state) {
  return {
    thermocron: state.thermocron,
    errors: state.errors,
    app: state.app
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
