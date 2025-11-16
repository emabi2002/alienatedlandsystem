'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type UserRole = 'admin' | 'land_officer' | 'applicant' | 'land_board_member'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
}

interface AuthContextType {
  user: User
  setUser: (user: User) => void
  isAuthenticated: boolean
}

// Mock users for development
export const MOCK_USERS: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'Admin User',
    email: 'admin@lands.gov.pg',
    role: 'admin',
    department: 'Administration'
  },
  land_officer: {
    id: '2',
    name: 'Land Officer',
    email: 'officer@lands.gov.pg',
    role: 'land_officer',
    department: 'Land Allocation'
  },
  applicant: {
    id: '3',
    name: 'John Applicant',
    email: 'john@example.com',
    role: 'applicant'
  },
  land_board_member: {
    id: '4',
    name: 'Board Member',
    email: 'board@lands.gov.pg',
    role: 'land_board_member',
    department: 'Land Board'
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default to admin user for development
  const [user, setUser] = useState<User>(MOCK_USERS.admin)
  const [isAuthenticated] = useState(true) // Always authenticated for development

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper function to check permissions (ready for RBAC)
export function hasPermission(user: User, permission: string): boolean {
  // For now, admins have all permissions
  if (user.role === 'admin') return true

  // Add your RBAC logic here later
  const permissions: Record<UserRole, string[]> = {
    admin: ['*'], // All permissions
    land_officer: ['view_applications', 'create_applications', 'update_applications', 'view_leases'],
    land_board_member: ['view_applications', 'approve_applications', 'view_board_meetings'],
    applicant: ['create_applications', 'view_own_applications']
  }

  return permissions[user.role]?.includes(permission) || permissions[user.role]?.includes('*')
}
