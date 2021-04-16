// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Routes from '../Routes';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {clearError} from "../actions/errors";
import {DEVICE_NAME} from "../constants/app";
import log from 'electron-log';
import {adapterConnected, adapterRemoved, fetchConfiguration} from "../actions/app";
import {Alert} from "reactstrap";
let usbDetect = require('usb-detection');


export class Root extends Component {

  componentDidMount() {
    //create a recurring function that check for connected device onto the app
    usbDetect.startMonitoring();
    let devicePid;
    usbDetect.find((err, devices) =>{
      log.info('find', devices, err);
      devices.filter((device) =>{
        if(device.deviceName.indexOf(DEVICE_NAME)  !== -1){
          this.props.adapterConnected();
          return true;
        }
      });
    });
    usbDetect.on('add', (device) =>{
      log.info('add', device);
      if(device.deviceName.indexOf(DEVICE_NAME) !== -1){
        this.props.adapterConnected();
        return true;
      }
    });

    usbDetect.on('remove', (device) => {
      log.info('remove', device);
      if (device.deviceName.indexOf(DEVICE_NAME) !== -1) {
        this.props.adapterRemoved();
        return true;
      }
    });
    this.props.fetchConfiguration();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //change page title accordigly to update status on usb device
    if(prevProps.app.adapterConnected === true && this.props.app.adapterConnected === false){
      //device disconnnected
      document.title = 'TIMon - 1-Wire USB connector non trovato'
    } else if (prevProps.app.adapterConnected === false && this.props.app.adapterConnected === true){
      document.title = 'TIMon - 1-Wire USB connector collegato'
    }
  }

  componentWillUnmount() {
    usbDetect.stopMonitoring()
  }

  render() {
    const { store, history, error, clearError } = this.props;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span>{error}</span>
          <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={clearError}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        }
      </Provider>
    );
  }
}

export default connect(
  state => ({
    error: state.errors,
    app: state.app
  }),
  dispatch => {
    return bindActionCreators(
      {
        clearError,
        adapterConnected,
        adapterRemoved,
        fetchConfiguration
      }, dispatch);
  }
)(Root);
