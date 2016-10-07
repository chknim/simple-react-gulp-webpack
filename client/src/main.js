"use strict"

import React from 'react';
import ReactDOM from 'react-dom';
import AppPage from './components/AppPage.js';

ReactDOM.render(
    <AppPage subjects={['javascript', 'java']}/>,
  document.getElementById('app-container')
);
