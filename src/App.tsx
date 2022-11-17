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

function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LoginPage />} />
            <Route path='signup' element={<SignupPage />} />
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
      </AuthProvider>
    </BrowserRouter >
  );
}

export default App;
