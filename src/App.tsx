import React from 'react';
import { MDBBtn, MDBContainer, MDBInputGroup } from 'mdb-react-ui-kit';
import { MDBInput } from 'mdb-react-ui-kit';

function App() {

  function performLogin(){
    console.log('logging in...')
  }
  
  return (
    <MDBContainer fluid>
      <MDBInputGroup className='mb-3' >
        <input className='form-control' type='email' placeholder="Email" />
      </MDBInputGroup>

      <MDBInputGroup className='mb-3' >
        <input className='form-control' type='password' placeholder="Password" />
      </MDBInputGroup>

      <MDBBtn onClick={performLogin}>Login</MDBBtn>
    </MDBContainer>
  );
}

export default App;
