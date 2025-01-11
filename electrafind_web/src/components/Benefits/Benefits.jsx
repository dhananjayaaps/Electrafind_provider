import React from 'react'
import { Link } from 'react-router-dom';
import './Benefits.css'
import benefit_1 from '../../assets/benefit-1.png'
import benefit_2 from '../../assets/benefit-2.png'
import benefit_3 from '../../assets/benefit-3.png'
import icon_1 from '../../assets/ev-icon-1.png'
import icon_2 from '../../assets/ev-icon-2.png'
import icon_3 from '../../assets/ev-icon-3.png'

const Benefits = () => {
    return (
    <div className='benefits'>
        <div className='benefit'>
            <img src={benefit_1} alt="" />
            <Link to="/register"><div className='caption'>
                <img src={icon_1} alt="" />
                <p>Home Charging</p>
            </div></Link>
        </div>
        <div className='benefit'>
            <img src={benefit_2} alt="" />
            <Link to="/map"><div className='caption'>
                <img src={icon_2} alt="" />
                <p>Charging Stations</p>
            </div></Link>  
        </div>
        <div className='benefit'>
            <img src={benefit_3} alt="" />
            <Link to="/servicestations"><div className='caption'>
                <img src={icon_3} alt="" />
                <p>Service Stations</p>
            </div></Link>
        </div>
    </div>
  )
}

export default Benefits