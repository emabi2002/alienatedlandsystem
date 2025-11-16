'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MapPin, Search, Layers, ZoomIn, ZoomOut, Navigation, Info, AlertCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'

// Dynamically import Leaflet to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
})

interface LandParcel {
  id: string
  parcel_number: string
  name: string
  parcel_type: string | null
  status: string
  area_hectares: number | null
  province_id: number | null
  district: string | null
  location_description: string
  coordinates: any
  valuation_amount: number | null
}

interface ParcelWithProvince extends LandParcel {
  province_name?: string
}

export default function GISPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParcel, setSelectedParcel] = useState<ParcelWithProvince | null>(null)
  const [parcels, setParcels] = useState<ParcelWithProvince[]>([])
  const [filteredParcels, setFilteredParcels] = useState<ParcelWithProvince[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load parcels from database
  useEffect(() => {
    async function loadParcels() {
      try {
        setLoading(true)

        // Query public view that includes province names
        const { data: parcelsData, error: parcelsError } = await supabase
          .from('land_parcels_view')
          .select('*')
          .order('created_at', { ascending: false })

        if (parcelsError) throw parcelsError

        // Data already includes province_name from the view
        const transformedData = parcelsData || []

        setParcels(transformedData)
        setFilteredParcels(transformedData)
      } catch (err: any) {
        console.error('Error loading parcels:', err)
        setError(err.message || 'Failed to load land parcels')
      } finally {
        setLoading(false)
      }
    }

    loadParcels()
  }, [])

  // Filter parcels based on search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredParcels(parcels)
      return
    }

    const filtered = parcels.filter(parcel =>
      parcel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.parcel_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.province_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.parcel_number.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredParcels(filtered)
  }, [searchTerm, parcels])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800 border-green-300'
      case 'leased': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'under_review': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'reserved': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'unavailable': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  // Parse coordinates from PostGIS format
  const parseCoordinates = (geojson: any): [number, number] | null => {
    if (!geojson) return null
    try {
      if (geojson.coordinates) {
        const [lng, lat] = geojson.coordinates
        return [lat, lng] // Leaflet uses [lat, lng]
      }
    } catch (err) {
      console.error('Error parsing coordinates:', err)
    }
    return null
  }

  // Transform parcels for map
  const mapParcels = filteredParcels
    .map(parcel => {
      const coords = parseCoordinates(parcel.coordinates)
      if (!coords) return null

      return {
        id: Number(parcel.id) || 0,
        name: parcel.name,
        type: parcel.parcel_type || 'Unknown',
        status: parcel.status,
        area: parcel.area_hectares ? `${parcel.area_hectares} hectares` : 'N/A',
        province: parcel.province_name || 'Unknown',
        coordinates: coords,
        description: parcel.location_description
      }
    })
    .filter(Boolean) as any[]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading land parcels...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
            <p className="font-semibold text-red-900 mb-2">Error Loading Parcels</p>
            <p className="text-sm text-gray-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">GIS Mapping System</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            {parcels.length} Parcels Loaded
          </Badge>
        </div>
        <p className="text-gray-600 mt-1">Interactive map of land parcels and lease locations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Land Parcels Map</CardTitle>
                <CardDescription>Click on markers to view parcel details</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" title="Zoom In">
                  <ZoomIn size={20} />
                </Button>
                <Button variant="outline" size="icon" title="Zoom Out">
                  <ZoomOut size={20} />
                </Button>
                <Button variant="outline" size="icon" title="Layers">
                  <Layers size={20} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[600px] w-full">
              <MapComponent
                parcels={mapParcels}
                onParcelSelect={(parcel: any) => {
                  const fullParcel = filteredParcels.find(p => Number(p.id) === parcel.id)
                  if (fullParcel) setSelectedParcel(fullParcel)
                }}
                selectedParcel={selectedParcel ? {
                  id: Number(selectedParcel.id) || 0,
                  name: selectedParcel.name,
                  type: selectedParcel.parcel_type || 'Unknown',
                  status: selectedParcel.status,
                  area: selectedParcel.area_hectares ? `${selectedParcel.area_hectares} hectares` : 'N/A',
                  province: selectedParcel.province_name || 'Unknown',
                  coordinates: parseCoordinates(selectedParcel.coordinates) || [0, 0],
                  description: selectedParcel.location_description
                } : null}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Parcels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  placeholder="Search by name, type, or province..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Selected Parcel Details */}
          {selectedParcel ? (
            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info size={20} className="text-emerald-600" />
                  Parcel Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-lg">{selectedParcel.name}</h4>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getStatusColor(selectedParcel.status)} variant="outline">
                      {selectedParcel.status.replace(/_/g, ' ')}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {selectedParcel.parcel_number}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{selectedParcel.parcel_type?.replace(/_/g, ' ') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-medium">
                      {selectedParcel.area_hectares ? `${selectedParcel.area_hectares} hectares` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Province:</span>
                    <span className="font-medium">{selectedParcel.province_name || 'Unknown'}</span>
                  </div>
                  {selectedParcel.district && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">District:</span>
                      <span className="font-medium">{selectedParcel.district}</span>
                    </div>
                  )}
                  {selectedParcel.valuation_amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valuation:</span>
                      <span className="font-medium">K {selectedParcel.valuation_amount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <p className="text-gray-700">{selectedParcel.location_description}</p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600">
                  Apply for This Parcel
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <MapPin size={48} className="mx-auto mb-2 opacity-20" />
                <p>Select a parcel on the map to view details</p>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Map Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Available for Lease</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Currently Leased</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>Under Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Reserved/Unavailable</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Parcels List */}
      <Card>
        <CardHeader>
          <CardTitle>Land Parcels ({filteredParcels.length})</CardTitle>
          <CardDescription>
            Browse all registered land parcels from database
            {searchTerm && ` - Filtered by "${searchTerm}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredParcels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredParcels.map(parcel => (
                <div
                  key={parcel.id}
                  onClick={() => setSelectedParcel(parcel)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedParcel?.id === parcel.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'hover:border-emerald-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{parcel.name}</h4>
                      <p className="text-xs text-gray-500">{parcel.parcel_number}</p>
                    </div>
                    <Badge className={getStatusColor(parcel.status)} variant="outline">
                      {parcel.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Type:</span> {parcel.parcel_type?.replace(/_/g, ' ') || 'N/A'}</p>
                    <p><span className="font-medium">Area:</span> {parcel.area_hectares ? `${parcel.area_hectares} ha` : 'N/A'}</p>
                    <p><span className="font-medium">Province:</span> {parcel.province_name || 'Unknown'}</p>
                    {parcel.valuation_amount && (
                      <p><span className="font-medium">Value:</span> K {parcel.valuation_amount.toLocaleString()}</p>
                    )}
                    <p className="text-xs mt-2">{parcel.location_description.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <MapPin size={48} className="mx-auto mb-2 opacity-20" />
              <p>No parcels found matching your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
