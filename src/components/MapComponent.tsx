'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet with Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface Parcel {
  id: number
  name: string
  type: string
  status: string
  area: string
  province: string
  coordinates: [number, number]
  description: string
}

interface MapComponentProps {
  parcels: Parcel[]
  onParcelSelect: (parcel: Parcel) => void
  selectedParcel: Parcel | null
}

export default function MapComponent({ parcels, onParcelSelect, selectedParcel }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map centered on Port Moresby, Papua New Guinea
      const map = L.map('map').setView([-9.4438, 147.1803], 11)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map
    }

    return () => {
      // Cleanup markers on unmount
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add markers for each parcel
    parcels.forEach(parcel => {
      const getMarkerColor = (status: string) => {
        switch (status) {
          case 'Available': return 'green'
          case 'Leased': return 'blue'
          case 'Under Review': return 'orange'
          default: return 'gray'
        }
      }

      const color = getMarkerColor(parcel.status)

      // Create custom colored icon
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      })

      const marker = L.marker(parcel.coordinates as [number, number], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-sm mb-1">${parcel.name}</h3>
            <p class="text-xs text-gray-600">${parcel.type} - ${parcel.status}</p>
            <p class="text-xs text-gray-600 mt-1">${parcel.area}</p>
          </div>
        `)
        .on('click', () => {
          onParcelSelect(parcel)
        })

      markersRef.current.push(marker)

      // Highlight selected parcel
      if (selectedParcel?.id === parcel.id) {
        marker.openPopup()
        mapRef.current?.setView(parcel.coordinates as [number, number], 13)
      }
    })
  }, [parcels, selectedParcel, onParcelSelect])

  return (
    <div id="map" className="w-full h-full rounded-b-lg" style={{ minHeight: '600px' }} />
  )
}
