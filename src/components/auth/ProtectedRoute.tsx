'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types/blog'
import { Loader2, Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredRoles,
  fallback,
  redirectTo = '/auth/login'
}: ProtectedRouteProps) {
  const { user, profile, loading, hasRole, hasAnyRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-secondary-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary-600 mx-auto mb-4" />
          <p className="text-brand-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  // User not authenticated
  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-brand-secondary-50">
        <div className="text-center">
          <Lock className="w-8 h-8 text-brand-secondary-400 mx-auto mb-4" />
          <p className="text-brand-secondary-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Check role requirements
  const hasRequiredRole = () => {
    if (!profile) return false
    
    if (requiredRole) {
      return hasRole(requiredRole)
    }
    
    if (requiredRoles) {
      return hasAnyRole(requiredRoles)
    }
    
    return true // No role requirement
  }

  // User doesn't have required role
  if (!hasRequiredRole()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-secondary-50">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg border border-brand-secondary-200 p-8">
            <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-brand-secondary-900 mb-2">
              Access Denied
            </h2>
            <p className="text-brand-secondary-600 mb-6">
              You don't have permission to access this page. 
              {requiredRole && ` Required role: ${requiredRole}`}
              {requiredRoles && ` Required roles: ${requiredRoles.join(', ')}`}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.back()}
                className="w-full bg-brand-secondary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-brand-secondary-700 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-brand-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-brand-primary-700 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredRole?: UserRole
    requiredRoles?: UserRole[]
    redirectTo?: string
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Role-specific protection components
export function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  )
}

export function EditorOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['admin', 'editor']}>
      {children}
    </ProtectedRoute>
  )
}

export function AuthorOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['admin', 'editor', 'author']}>
      {children}
    </ProtectedRoute>
  )
}
