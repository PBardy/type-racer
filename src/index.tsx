import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import SecureRouter from './routes/router';

ReactDOM.render(
  <React.StrictMode>
    <SecureRouter />
  </React.StrictMode>,
  document.getElementById('root')
);
