import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { PersistGate } from 'redux-persist/integration/react';
import './App.css';
import { persistor, store } from './redux';
import React, { useEffect } from 'react';
import PrivateRouter from './router/privaterouter';
import LayoutDashboard from './layout';
import { privateRoutes, publicRoutes } from './router';
import { useAppSelector } from './redux/hook';
import SSEListener from './components/SSEListener';
import { LoadingProvider } from './components/Loading';
import LoadingUI from './components/LoadingUI';
function App() {
  return (
    <Provider store={store}>
      <LoadingProvider>
        <BrowserRouter>
          <PersistGate loading={null} persistor={persistor}>
            <SSEListener />
            <LoadingUI />
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
      </LoadingProvider>
    </Provider>
  )
}

export default App
