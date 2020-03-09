// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Routes from '../Routes';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {clearError} from "../actions/errors";

export class Root extends Component {
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
