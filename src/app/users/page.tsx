import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-1">Manage system users and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <Users size={24} />
            </div>
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Coming soon - User administration features</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">This page is under development.</p>
        </CardContent>
      </Card>
    </div>
  )
}
