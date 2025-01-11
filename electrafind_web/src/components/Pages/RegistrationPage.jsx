import React from 'react'
import Navbar from '../Navbar/Navbar'
import RegQR from '../RegQR/RegQR'
import '../../index.css'

const RegistrationPage = () => {
  return (
    <div>
        <Navbar/>
        <div className='container'>
          <RegQR/>
        </div>
    </div>
  );
};

export default RegistrationPage;