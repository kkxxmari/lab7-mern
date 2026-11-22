// React builds our page from the smaller components below.
// ReactDOM is the part that places that component tree in the browser.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
// Import our own CSS last so it can adjust the Bootstrap defaults.
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
// Place our app inside the root element from the HTML page.
// One shared router keeps the menu and the page content in step.
ReactDOM.createRoot(document.getElementById('root')).render(
  // Development checks help us spot effects that need a proper cleanup.
  // They do not mean a user has submitted the form twice.
  <React.StrictMode>
    {/* Keep one router around the whole app, rather than one per page.
        Links and route matching can then share the current address. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
