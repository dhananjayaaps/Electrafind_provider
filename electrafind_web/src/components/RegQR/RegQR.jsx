import React from 'react'
import { Link } from 'react-router-dom';
import './RegQR.css'
import qrDriverApp from '../../assets/qr-driver-app.png'
import qrHomeChargerApp from '../../assets/qr-home-charger-app.png'
import homeCharger from '../../assets/benefit-1.png'
import evDriver from '../../assets/ev-driver.png'

const RegQR = () => {
  return (
    <div>
        <div className='registration'>
              <div className='registration-section'>
                <img src={evDriver} alt="EV Driver" />
                <div className='qr'>
                    <h2>Download Now!</h2>
                    <p>EV Driver's App</p>
                    <img src={qrDriverApp} alt="QR Code for EV Driver's App" />
                </div>
            </div>
            <div className='registration-section'>
                <img src={homeCharger} alt="EV Home Charger" />
                <div className='qr'>
                    <h2>Download Now!</h2>
                    <p>EV Home Charger Provider's App</p>
                    <img src={qrHomeChargerApp} alt="QR Code for EV Home Charger Provider's App" />
                </div>
            </div>
        </div>
        {/* <div className='admin-login'>
            <Link to="/admin-login"><p>Login as Admin</p></Link>
        </div> */}
    </div>
  )
}

export default RegQR