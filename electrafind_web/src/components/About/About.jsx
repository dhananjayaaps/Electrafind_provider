import React from 'react'
// import { Link } from 'react-router-dom';
import './About.css'
import image from '../../assets/logo-2.png'
// import arrow from '../../assets/arrow.png'

const About = () => {
    return (
        <div className='about-container'>
            <div className='heading-container'>
                <div className='about-text'>
                    <h1>ElectraFind</h1>
                    <h3>Power Up Anywhere</h3>
                    <p>ElectraFind was founded in 2024 by a group of students at the University of Colombo School of Computing. Initially EletraFind will be developed as a part of their curriculum. If we receive positive feedback from the users after the initial lauch we will take necessary actions to develop this further as a commercial app.</p>
                </div>
                <div className='image-container'>
                    <img src={image} alt="" />
                </div>
                {/* <Link to="/register"><button className='btn'>Register Now <img src={arrow} alt=""/></button></Link> */}
            </div>
            <div className='vision'>
                <h1>Our Vision</h1>
                <p>To revolutionize the electric vehicle experience in Sri Lanka by creating a seamless, accessible, and reliable charging infrastructure that empowers EV drivers and promotes sustainable transportation.</p>
            </div>

            <div className='mission'>
                <h1>Our Mission</h1>
                <p>Our mission is to provide a comprehensive mobile platform that connects EV drivers with both official charging stations and household chargers. By offering real-time information, easy payment solutions, and a community-driven approach, we aim to eliminate range anxiety, encourage the adoption of electric vehicles, and support the growth of eco-friendly transportation solutions across the nation.</p>
            </div>

            <div className='social'>
                <h1>Our Social Responsibility</h1>
                <p>At ElectraFind, we recognize our role in fostering a sustainable future. Our commitment extends beyond merely connecting EV drivers to charging stations. We aim to:</p>
                <ul>
                    <li><b>Promote Environmental Awareness:</b> Encourage the adoption of electric vehicles as a cleaner, more sustainable alternative to traditional fossil fuel-powered transportation, reducing carbon emissions and promoting environmental conservation.</li>
                    <li><b>Support Community Growth:</b> Empower local communities by providing opportunities for households to offer charging services, thereby fostering a sense of community involvement and economic growth.</li>
                    <li><b>Enhance Accessibility:</b> Ensure that all EV drivers, regardless of location, have access to reliable and convenient charging options, promoting equity and inclusivity in the transition to greener transportation solutions.</li>
                    <li><b>Educate and Advocate:</b> Raise awareness about the benefits of electric vehicles and sustainable practices through educational initiatives, partnerships, and advocacy, contributing to a broader understanding and acceptance of eco-friendly technologies.</li>
                </ul>
                <p>Our dedication to social responsibility is integral to our mission. We believe in making a positive impact on society by not only advancing technology but also by being mindful stewards of the environment and community well-being.</p>
            </div>
        </div>
    )
}

export default About