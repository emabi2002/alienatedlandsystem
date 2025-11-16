import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure system settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <Settings size={24} />
            </div>
            <div>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Coming soon - Configuration options</CardDescription>
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
