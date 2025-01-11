import React from 'react'
import { Link } from 'react-router-dom';
import './Hero.css'
import arrow from '../../assets/arrow.png'

const Hero = () => {
  return (
    <div className='hero container'>
        <div className="hero-text">
          <h1>Power Up Anywhere</h1>
          <p>Welcome to ElectraFind, where you can power up anywhere!</p>
          <p>Our app connects EV users with homeowners offering charging options, ensuring you never have to worry about finding a charging station. ElectraFind opens up a world of possibilities, allowing you to travel longer distances confidently.</p>
          <p>Join us in revolutionizing EV travel and start charging smart with ElectraFind.</p>
          <Link to="/register"><button className='btn'>Register Now <img src={arrow} alt=""/></button></Link>
        </div>
    </div>
  )
}

export default Hero