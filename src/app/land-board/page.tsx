import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2 } from 'lucide-react'

export default function LandBoardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Land Board</h1>
        <p className="text-gray-600 mt-1">Land Board meetings and decisions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <Building2 size={24} />
            </div>
            <div>
              <CardTitle>Land Board Management</CardTitle>
              <CardDescription>Coming soon - Land Board information and decisions</CardDescription>
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
