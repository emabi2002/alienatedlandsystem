'use client'

import { useAuth, hasPermission } from '@/lib/auth-context'
import { ReactNode } from 'react'

interface ProtectedFeatureProps {
  permission?: string
  roles?: string[]
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedFeature({
  permission,
  roles,
  children,
  fallback = null
}: ProtectedFeatureProps) {
  const { user } = useAuth()

  // Check permission if provided
  if (permission && !hasPermission(user, permission)) {
    return <>{fallback}</>
  }

  // Check roles if provided
  if (roles && !roles.includes(user.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
