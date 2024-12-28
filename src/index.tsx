import React from 'react';
import ReactDOM from 'react-dom/client';
import { D2synt } from './d2synt';
import { LocaleProvider } from './contexts/LocaleContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <ThemeProvider>
            <LocaleProvider>
                <D2synt />
            </LocaleProvider>
        </ThemeProvider>
    </React.StrictMode>
);
