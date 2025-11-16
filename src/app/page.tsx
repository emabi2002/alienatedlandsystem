'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, TrendingUp, Clock, CheckCircle, DollarSign, Users, MapPin, AlertCircle } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/lib/auth-context'
import { Badge } from '@/components/ui/badge'
import { supabase, views } from '@/lib/supabase'

interface DashboardStats {
  total_applications: number
  pending_review: number
  approved_applications: number
  active_leases: number
  expiring_soon: number
  applications_this_month: number
  total_annual_revenue: number | null
  available_parcels: number
}

interface MonthlyStats {
  month: string
  total_applications: number
  approved: number
  rejected: number
  pending: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch dashboard statistics
        const { data: statsData, error: statsError } = await views
          .dashboardStatistics()
          .select('*')
          .single()

        if (statsError) throw statsError

        // Fetch monthly statistics (last 6 months)
        const { data: monthlyStatsData, error: monthlyError } = await views
          .monthlyStats()
          .select('*')
          .order('month', { ascending: false })
          .limit(6)

        if (monthlyError) throw monthlyError

        setStats(statsData)
        setMonthlyData(monthlyStatsData?.reverse() || [])
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format month for display
  const formatMonth = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short' })
  }

  // Prepare data for charts
  const monthlyChartData = monthlyData.map(item => ({
    month: formatMonth(item.month),
    applications: item.total_applications,
    approved: item.approved,
    revenue: Math.floor((item.approved || 0) * 50) // Estimated revenue per approval
  }))

  const statusData = stats ? [
    { status: 'Pending', count: stats.pending_review },
    { status: 'Approved', count: stats.approved_applications },
    { status: 'This Month', count: stats.applications_this_month },
  ] : []

  // Sample lease type distribution (would come from another query in production)
  const leaseTypeData = [
    { name: 'Business Commercial', value: 425, color: '#10b981' },
    { name: 'Residential', value: 890, color: '#3b82f6' },
    { name: 'Agricultural', value: 567, color: '#f59e0b' },
    { name: 'Industrial', value: 234, color: '#8b5cf6' },
    { name: 'Special Purpose', value: 156, color: '#ec4899' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <AlertCircle size={48} className="mx-auto mb-4" />
              <p className="font-semibold mb-2">Error Loading Dashboard</p>
              <p className="text-sm text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) return null

  const statsCards = [
    {
      title: 'Total Applications',
      value: stats.total_applications.toLocaleString(),
      change: '+12.5%',
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Pending Review',
      value: stats.pending_review.toLocaleString(),
      change: '+3.2%',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Approved Leases',
      value: stats.approved_applications.toLocaleString(),
      change: '+8.1%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Revenue (K)',
      value: stats.total_annual_revenue
        ? `${(stats.total_annual_revenue / 1000).toFixed(1)}K`
        : '0',
      change: '+15.3%',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Leases',
      value: stats.active_leases.toLocaleString(),
      change: '+5.7%',
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Available Parcels',
      value: stats.available_parcels.toLocaleString(),
      change: '0%',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Expiring Soon',
      value: stats.expiring_soon.toLocaleString(),
      change: '+2',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'This Month',
      value: stats.applications_this_month.toLocaleString(),
      change: '+18.2%',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Badge className="bg-emerald-600">
            {user.role.replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            Live Data
          </Badge>
        </div>
        <p className="text-gray-600 mt-1">
          Welcome back, <span className="font-semibold">{user.name}</span>! Here's your overview.
        </p>
      </div>

      {/* User Info Card */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-emerald-900">
                {user.role === 'admin' && 'Administrator Dashboard'}
                {user.role === 'land_officer' && 'Land Officer Portal'}
                {user.role === 'applicant' && 'Applicant Portal'}
                {user.role === 'land_board_member' && 'Land Board Portal'}
              </h3>
              <p className="text-sm text-emerald-700 mt-1">
                {user.department && `${user.department} • `}
                {user.email}
              </p>
              {user.role === 'admin' && (
                <p className="text-xs text-emerald-600 mt-2">
                  ✓ Full system access • All permissions granted
                </p>
              )}
              {user.role === 'applicant' && (
                <p className="text-xs text-emerald-600 mt-2">
                  You can submit applications and track your submissions
                </p>
              )}
            </div>
            <Badge variant="outline" className="bg-white border-emerald-300 text-emerald-700">
              Active Session
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                    <p className="text-sm text-emerald-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Applications & Approvals Trend</CardTitle>
            <CardDescription>Monthly statistics from database</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="applications" stroke="#10b981" strokeWidth={2} name="Applications" />
                  <Line type="monotone" dataKey="approved" stroke="#3b82f6" strokeWidth={2} name="Approved" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp size={48} className="mx-auto mb-2 opacity-20" />
                  <p>No monthly data available yet</p>
                  <p className="text-xs mt-1">Data will appear as applications are submitted</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lease Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lease Types Distribution</CardTitle>
            <CardDescription>Sample data - Active leases by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leaseTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leaseTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (K)</CardTitle>
            <CardDescription>Estimated monthly revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue (K)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>No revenue data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Current applications by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Now from Database */}
      <RecentActivity />
    </div>
  )
}

// Recent Activity Component
interface RecentApplication {
  id: string
  application_number: string
  applicant_name: string
  application_type: string
  status: string
  submitted_at: string
  created_at: string
}

function RecentActivity() {
  const [applications, setApplications] = useState<RecentApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentApplications() {
      try {
        const { data, error } = await supabase
          .from('application_summary')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4)

        if (error) throw error
        setApplications(data || [])
      } catch (err) {
        console.error('Error fetching recent applications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentApplications()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest applications from database</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading recent activity...</div>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{app.application_number}</p>
                  <p className="text-sm text-gray-600">
                    {app.applicant_name} - {app.application_type?.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                    app.status === 'submitted' || app.status === 'pending_land_board' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {app.status?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-2 opacity-20" />
            <p>No applications yet</p>
            <p className="text-xs mt-1">Applications will appear here as they are submitted</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
