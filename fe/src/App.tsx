import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import './App.css';
import { persistor, store } from './redux';
import RouterApp from './router';
import { PersistGate } from 'redux-persist/integration/react';
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <RouterApp />
        </PersistGate>
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  )
}

export default App
