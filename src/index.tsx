import React from 'react';
import ReactDOM from 'react-dom';
import { App } from '@components/app';
import reportWebVitals from './reportWebVitals';
import './styles/global.css';
import { PopupModule } from './modules/popup';
import { ElementsModule } from '@modules/elements';
import { ScaleModule } from '@modules/scale';

ReactDOM.render(
  <React.StrictMode>
    <ScaleModule>
      <ElementsModule>
        <PopupModule>
          <App />
        </PopupModule>
      </ElementsModule>
    </ScaleModule>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
