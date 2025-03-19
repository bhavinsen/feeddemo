import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'material-react-toastify';

import { SocketProvider } from './contexts/socket';
import App from './App';

import 'material-react-toastify/dist/ReactToastify.css';
import './App.css';

console.log(import.meta.env.VITE_APP_SOCKET_URL) // "123"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SocketProvider>
      <App />
      <ToastContainer position="top-center" />
    </SocketProvider>
  </React.StrictMode>
);