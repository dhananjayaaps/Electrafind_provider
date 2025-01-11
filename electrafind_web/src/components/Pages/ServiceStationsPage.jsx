import React from 'react'
import Navbar from '../Navbar/Navbar'
import ServiceStation from '../ServiceStation/ServiceStation'
import ServiceMap from '../ServiceMap/ServiceMap'
import '../../index.css'

const ServiceStationsPage = () => {
  return (
    <div>
        <Navbar/>
        <ServiceStation />
        <ServiceMap/>
    </div>
  )
}

export default ServiceStationsPage