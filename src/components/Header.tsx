'use client'

import { Bell, User, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useAuth, MOCK_USERS } from '@/lib/auth-context'

export function Header() {
  const { user, setUser } = useAuth()
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Land Administration System</h2>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
              Dev Mode
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Manage state land leases and applications</p>
        </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-emerald-600">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="font-medium">New Land Board Meeting</p>
                <p className="text-xs text-gray-600">Scheduled for Jan 20, 2025</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="font-medium">Application Approved</p>
                <p className="text-xs text-gray-600">Lease #12345 has been approved</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="font-medium">Renewal Due</p>
                <p className="text-xs text-gray-600">5 leases expiring this month</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback className="bg-emerald-600 text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-600 capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2" size={16} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-gray-500">
              Switch User (Dev Mode)
            </DropdownMenuLabel>
            {Object.entries(MOCK_USERS).map(([key, mockUser]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setUser(mockUser)}
                className={user.id === mockUser.id ? 'bg-emerald-50' : ''}
              >
                <Users className="mr-2" size={16} />
                {mockUser.name}
                <Badge variant="outline" className="ml-auto text-xs">
                  {mockUser.role.replace('_', ' ')}
                </Badge>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
