import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import PaginaPage from './containers/PaginaPage';
import PaginaNewPage from './containers/PaginaNewPage';
import ConfigurationPage from "./containers/ConfigurationPage";

export default () => (
  <App>
    <Switch>
      <Route path={routes.PAGINANEW} component={PaginaNewPage} exact={true} />
      <Route path={routes.PAGINA} component={PaginaPage} exact={true} />
      <Route path={routes.CONFIGURATION} component={ConfigurationPage} exact={true} />
    </Switch>
  </App>
);
