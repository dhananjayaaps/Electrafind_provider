import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css'
import logo from '../../assets/logo.png'

const Navbar = () => {

  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      window.scrollY > 50 ? setSticky(true) : setSticky(false);
    })
  }, []);
  
  return (
    <nav className={`container ${sticky? 'dark-nav' : ''}`}>
        <img src={logo} alt="" className='logo'/>
        <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/map/">Map</Link></li>
              <li><Link to="/servicestations">Service Stations</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/register"><button className='btn'>Register</button></Link></li>
        </ul>
    </nav>
  )
}

export default Navbar