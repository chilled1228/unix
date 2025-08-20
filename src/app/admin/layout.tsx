import { Metadata } from 'next'
import { AuthorOnly } from '@/components/auth/ProtectedRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Unix Timestamp Converter',
  description: 'Manage your blog content, users, and settings.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthorOnly>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AuthorOnly>
  )
}
