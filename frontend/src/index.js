import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';
import store from './store';

import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </CookiesProvider>,
);
