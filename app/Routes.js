import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import PaginaPage from './containers/PaginaPage';
import PaginaNewPage from './containers/PaginaNewPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.PAGINANEW} component={PaginaNewPage} />
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.PAGINA} component={PaginaPage} />
    </Switch>
  </App>
);
