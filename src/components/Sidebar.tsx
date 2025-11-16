'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Map,
  Users,
  Settings,
  Building2,
  ClipboardList,
  TrendingUp,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: FileText, label: 'Applications', href: '/applications' },
  { icon: ClipboardList, label: 'Submit Request', href: '/submit-request' },
  { icon: Building2, label: 'Land Board', href: '/land-board' },
  { icon: Calendar, label: 'Events Calendar', href: '/calendar' },
  { icon: Map, label: 'GIS Mapping', href: '/gis' },
  { icon: TrendingUp, label: 'Reports', href: '/reports' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-emerald-600 via-green-600 to-emerald-700 text-white shadow-2xl transition-transform duration-300 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <h1 className="text-2xl font-bold">Land Admin</h1>
            <p className="text-sm text-emerald-100 mt-1">Department of Lands</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-white text-emerald-700 shadow-lg font-semibold"
                          : "hover:bg-white/10 text-white/90 hover:text-white"
                      )}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <p className="text-xs text-emerald-100 text-center">
              © 2025 PNG Lands
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
