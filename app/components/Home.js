// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';

export default class Home extends Component {
  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>OneWire Platform</h2>
        <Link to={routes.COUNTER}>to iButton Manager</Link>
        <br/>
        <Link to={routes.PAGINA}>to Pagina</Link>
        <button className={'btn btn-succes'}>ciao</button>
      </div>
    );
  }
}
