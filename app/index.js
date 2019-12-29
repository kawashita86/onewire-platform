import React from 'react';
import { render } from 'react-dom';
import { AppContainer  } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
import '!style-loader!css-loader!react-table/react-table.css';
import '!style-loader!css-loader!smalltalk/css/smalltalk.css';
import './app.global.css';

const store = configureStore();

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
