import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { PersistGate } from 'redux-persist/integration/react';
import './App.css';
import { persistor, store } from './redux';
import React from 'react';
import PrivateRouter from './router/privaterouter';
import LayoutDashboard from './layout';
import { privateRoutes, publicRoutes } from './router';
function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route path="/" element={
              <PrivateRouter>
                <LayoutDashboard />
              </PrivateRouter>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              {privateRoutes.map(({ path, element }, index) => (
                <Route key={index} path={path} element={element} />
              ))}
            </Route>

            {publicRoutes.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}
          </Routes>
        </PersistGate>
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  )
}

export default App
