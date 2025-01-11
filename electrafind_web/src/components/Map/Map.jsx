import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import './Map.css'

const center = {
  lat: 6.912688,
  lng: 79.864437
}

const locations = [
  { lat: 6.911437, lng: 79.865062, name: 'chargeNET Charging Station', type: 'station' },
  { lat: 6.9271, lng: 79.8612, name: 'Savini\'s House', type: 'home' },
]

const icons = {
  home: {
    url: '/assets/location-pin-home.png',
    scaledSize: { width: 32, height: 32 }
  },
  station: {
    url: '/assets/location-pin-station.png',
    scaledSize: { width: 32, height: 32 }
  }
}

const Map = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyDTYD4DNXMdQCRcjy0-ePWn5OpM0Ggki54">
      <GoogleMap
        mapContainerClassName='map-container'
        center={center}
        zoom={12}
      >
        {locations.map((locations, index) => (
          <Marker
            key = {index}
            position = {{ lat: locations.lat, lng: locations.lng }}
            icon={icons[locations.type]}
            title={locations.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}

export default Map