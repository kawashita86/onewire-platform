// @flow
import React, { Component, useState } from 'react';
import styles from './PaginaNew.css';
import { Link } from "react-router-dom";
import routes from '../constants/routes';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import classnames from 'classnames';

const PaginaNew = (props) => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
      if(activeTab !== tab) setActiveTab(tab);
    }
    return (
      <div className={'container'} data-tid="container">
        <Link to={routes.HOME}>
          <i className="fa fa-arrow-left fa-3x" />
        </Link>
        <div className="container">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => { toggle('1'); }}
              >
                Media giornaliera
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => { toggle('2'); }}
              >
                Resoconto mensile
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '3' })}
                onClick={() => { toggle('3'); }}
              >
                Calendario
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12" className={'text-center'}>
                  <h4 className={styles.titolettiPagine} data-tclass='titolettiPagine'>Media giornaliera</h4>
                  <span className={styles.bottonePercentuale}
                          data-tclass="bottonePercentuale">80%</span>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  <h4>Grafico media mensile</h4>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="3">
              <Row>
                <Col sm="12">
                  <h4>Calendario con link ai giorni</h4>

                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>


      </div>
    );
  }

export default PaginaNew;
