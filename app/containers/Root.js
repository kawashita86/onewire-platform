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
let usbDetect = require('usb-detection');


export class Root extends Component {
  componentDidMount() {
    //create a recurring function that check for connected device onto the app
    usbDetect.startMonitoring();
    let devicePid;
    usbDetect.find(function(err, devices) {
      log.info('find', devices, err);
      let deviceFound = devices.filter((device) =>{
        return device.deviceName.indexOf(DEVICE_NAME)  !== -1;
      })
      if(!deviceFound){
      } else {
        document.title += ' '+deviceFound[0].serialNumber;
        devicePid = deviceFound[0].productId;
      }
    });
    usbDetect.on('add', function(device) {
      log.info('add', device);
      if(device.deviceName.indexOf(DEVICE_NAME) !== -1){
        document.title += ' '+device.productId;
        devicePid = device.productId;
      }
    });
    usbDetect.on('remove', function(device) {
      log.info('remove', device);
      if(devicePid && device.productId === devicePid){
        devicePid = null;
        document.title.replace(' '+device.serialNumber, '');
      }});
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
  }),
  dispatch => {
    return bindActionCreators(
      {
        clearError,
      }, dispatch);
  }
)(Root);
