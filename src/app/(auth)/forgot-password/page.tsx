// src/app/(auth)/forgot-password/page.tsx
import { AuthLayout } from '@/components/auth/auth-layout'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email to receive a password reset link"
      showBackButton={true}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}