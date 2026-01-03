// Complaint categories and priorities

export const COMPLAINT_CATEGORIES = [
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'cleanliness', label: 'Cleanliness' },
  { value: 'security', label: 'Security' },
  { value: 'internet', label: 'Internet/WiFi' },
  { value: 'pest', label: 'Pest Control' },
  { value: 'other', label: 'Other' },
] as const

export const COMPLAINT_PRIORITIES = [
  { value: 'low', label: 'Low', description: 'Non-urgent issues' },
  { value: 'medium', label: 'Medium', description: 'Standard priority' },
  { value: 'high', label: 'High', description: 'Requires prompt attention' },
  { value: 'urgent', label: 'Urgent', description: 'Critical issues requiring immediate action' },
] as const

export const COMPLAINT_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
] as const

// Type exports for type safety
export type ComplaintCategory = (typeof COMPLAINT_CATEGORIES)[number]['value']
export type ComplaintPriority = (typeof COMPLAINT_PRIORITIES)[number]['value']
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number]['value']
