import { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create Account - Unix Timestamp Converter',
  description: 'Create an account to join our blog community and start sharing your content.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-brand-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignupForm />
    </div>
  )
}
