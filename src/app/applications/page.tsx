'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Search, Filter, Download, Eye, AlertCircle, Calendar, MapPin } from 'lucide-react'
import { db, views } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface Application {
  id: string
  application_number: string
  applicant_name: string
  email: string
  application_type: string
  status: string
  submitted_at: string | null
  province_name: string | null
  parcel_number: string | null
  parcel_name: string | null
  area_requested: number | null
  estimated_development_value: number | null
  created_at: string
}

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Load applications from database
  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true)
        const { data, error } = await views.applicationSummary()
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setApplications(data || [])
        setFilteredApplications(data || [])
      } catch (err) {
        console.error('Error loading applications:', err)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [])

  // Filter applications
  useEffect(() => {
    let filtered = applications

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.application_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(app => app.application_type === typeFilter)
    }

    setFilteredApplications(filtered)
  }, [searchTerm, statusFilter, typeFilter, applications])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300'
      case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'pending_land_board': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300'
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'requires_revision': return 'bg-orange-100 text-orange-800 border-orange-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusStats = () => {
    return {
      total: applications.length,
      submitted: applications.filter(a => a.status === 'submitted').length,
      under_review: applications.filter(a => a.status === 'under_review').length,
      pending_land_board: applications.filter(a => a.status === 'pending_land_board').length,
      approved: applications.filter(a => a.status === 'approved').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    }
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">View and manage lease applications</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-green-600">
          <Download size={16} className="mr-2" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Submitted</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.submitted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Under Review</p>
            <p className="text-2xl font-bold text-blue-600">{stats.under_review}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Land Board</p>
            <p className="text-2xl font-bold text-purple-600">{stats.pending_land_board}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Search by application number, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="pending_land_board">Pending Land Board</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="requires_revision">Requires Revision</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="business_commercial">Business Commercial</SelectItem>
                <SelectItem value="residential_high">Residential</SelectItem>
                <SelectItem value="agricultural">Agricultural</SelectItem>
                <SelectItem value="business_industrial">Industrial</SelectItem>
                <SelectItem value="special_purpose">Special Purpose</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Applications ({filteredApplications.length})</CardTitle>
              <CardDescription>
                {filteredApplications.length === applications.length
                  ? 'Showing all applications'
                  : `Filtered from ${applications.length} total applications`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredApplications.length > 0 ? (
            <div className="space-y-3">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Application Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{app.application_number}</h3>
                        <Badge className={getStatusColor(app.status)} variant="outline">
                          {app.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{app.applicant_name}</p>
                      <p className="text-xs text-gray-500">{app.email}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <FileText size={12} />
                          {app.application_type.replace(/_/g, ' ')}
                        </span>
                        {app.province_name && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {app.province_name}
                          </span>
                        )}
                        {app.submitted_at && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(app.submitted_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col md:items-end gap-2">
                      {app.area_requested && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Area:</span> {app.area_requested} ha
                        </p>
                      )}
                      {app.estimated_development_value && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Value:</span> K {app.estimated_development_value.toLocaleString()}
                        </p>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye size={14} className="mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <AlertCircle size={48} className="mx-auto mb-2 opacity-20" />
              <p>No applications found matching your filters</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setTypeFilter('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
