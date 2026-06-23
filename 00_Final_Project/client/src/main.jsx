import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './index.css'; 

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate

import App from './App.jsx';
import { store, persistor } from './Redux-toolkit/Store.jsx'; // Import both store and persistor

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* PersistGate delays the rendering of your app until your persisted state has been retrieved and saved to redux */}
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);