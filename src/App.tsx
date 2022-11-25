import React from 'react';
import { MDBBtn, MDBContainer, MDBInputGroup } from 'mdb-react-ui-kit';
import { MDBInput } from 'mdb-react-ui-kit';
import AuthProvider, { RequireAuth } from './providers/auth.provider';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout.component';
import DashboardPage from './pages/dashboard.page';
import LoginPage from './pages/login.page';
import SignupPage from './pages/signup.page';
import CredentialsPage from './pages/credentials.page';
import ConfigurationPage from './pages/configuration.page';
import AboutPage from './pages/about.page';
import AlertProvider from './providers/alert.provider';

function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LoginPage />} />
              <Route path='signup' element={<SignupPage />} />
              <Route path='about' element={<AboutPage />} />
              <Route path='configuration' element={
                <RequireAuth>
                  <ConfigurationPage />
                </RequireAuth>} />

              <Route path='credentials' element={
                <RequireAuth>
                  <CredentialsPage />
                </RequireAuth>} />
              <Route path='dashboard' element={(
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>)} />
            </Route>
          </Routes>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter >
  );
}

export default App;
