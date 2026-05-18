export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

let listeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []

export function showToast(message: string, type: Toast['type'] = 'success', duration = 3000) {
  const id = Math.random().toString(36).slice(2)
  const toast: Toast = { id, message, type, duration }
  toasts = [...toasts, toast]
  listeners.forEach(l => l(toasts))
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id)
    listeners.forEach(l => l(toasts))
  }, duration)
}

export function subscribe(fn: (toasts: Toast[]) => void) {
  listeners.push(fn)
  return () => { listeners = listeners.filter(l => l !== fn) }
}