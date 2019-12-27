import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import ErrorHandler from './ErrorHandler';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/analytics';
import createStore from './state/createStore';
import './i18n';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

const bugsnagClient = bugsnag('e7635146948016ee1b43e1c7a2c55485');
bugsnagClient.use(bugsnagReact, React);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB7cUcrarx0CFuFXTsUaeY3W4AtPG5Fiig',
  authDomain: 'feedfarm-app.firebaseapp.com',
  databaseURL: 'https://feedfarm-app.firebaseio.com',
  projectId: 'feedfarm-app',
  storageBucket: 'feedfarm-app.appspot.com',
  messagingSenderId: '465705245819',
  appId: '1:465705245819:web:fd728c1fa29aa0f0b496de',
  measurementId: 'G-P0HVZPS0RC',
};
// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {}
firebase.analytics();

if (process.env.NODE_ENV === 'development') {
  window.firebase = firebase;
}

if (window.localStorage.getItem('pga') === 'true') {
  window['ga-disable-UA-7442821-14'] = true;
}

// firebase.firestore(); // <- needed if using firestore
// firebase.functions(); // <- needed if using httpsCallable
// firebase.storage(); // <- needed if using httpsCallable

const store = createStore();

const ErrorBoundary = bugsnagClient.getPlugin('react');

async function init() {
  ReactDOM.render(
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={ErrorHandler}>
        <Router>
          <App />
        </Router>
      </ErrorBoundary>
    </Provider>,
    document.getElementById('root'),
  );
}

init();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
