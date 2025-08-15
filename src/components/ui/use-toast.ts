// src/components/ui/use-toast.ts
// Using Sonner for modern toast notifications
import { toast as sonnerToast } from 'sonner'

interface ToastProps {
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
}

export function toast({ title, description, variant = 'default' }: ToastProps) {
  const message = description ? `${title}\n${description}` : title

  switch (variant) {
    case 'destructive':
      sonnerToast.error(title, { description })
      break
    case 'success':
      sonnerToast.success(title, { description })
      break
    default:
      sonnerToast(title, { description })
      break
  }
}