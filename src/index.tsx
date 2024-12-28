import React from 'react';
import ReactDOM from 'react-dom/client';
import { D2synt } from './d2synt';
import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <D2synt />
  </React.StrictMode>
);