// Status and priority color mappings for consistent styling across the app

export const STATUS_COLORS = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  'in-progress': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  resolved: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
} as const

export const PRIORITY_COLORS = {
  low: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
  },
  medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  high: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
  },
  urgent: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },
} as const

// Brand colors
export const BRAND_COLORS = {
  primary: '#5e2a84',
  primaryHover: '#4a2169',
  primaryLight: 'purple-50',
} as const

// Status badge variants for use with UI components
export type StatusType = keyof typeof STATUS_COLORS
export type PriorityType = keyof typeof PRIORITY_COLORS

export function getStatusColor(status: string) {
  return STATUS_COLORS[status as StatusType] || STATUS_COLORS.pending
}

export function getPriorityColor(priority: string) {
  return PRIORITY_COLORS[priority as PriorityType] || PRIORITY_COLORS.low
}
