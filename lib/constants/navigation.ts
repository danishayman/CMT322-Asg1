// Navigation link types and configurations for role-based sidebars

export type NavLinkRoute = {
  name: string
  type: 'route'
  path: string
  icon: string
}

export type NavLinkAnchor = {
  name: string
  type: 'anchor'
  targetId: string
  icon: string
}

export type NavLink = NavLinkRoute | NavLinkAnchor

// Common SVG icon paths
export const ICONS = {
  dashboard:
    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  overview: 'M13 10V3L4 14h7v7l9-11h-7z',
  complaints: 'M12 20h9M12 4h9m-9 8h9M3 7h6v10H3z',
  activeTicket:
    'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2ZM12 8v4M12 16h.01',
  pendingTicket:
    'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2ZM12 6v6l4 2',
  resolvedTicket:
    'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2ZM8 12l2 2 4-4',
  add: 'M12 4v16m8-8H4',
  document:
    'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  logout:
    'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  menu: 'M4 6h16M4 12h16M4 18h16',
  collapseLeft: 'M11 19l-7-7 7-7m8 14l-7-7 7-7',
  collapseRight: 'M13 5l7 7-7 7M5 5l7 7-7 7',
} as const

// Admin navigation links
export const adminNavLinks: NavLink[] = [
  {
    name: 'Dashboard',
    type: 'route',
    path: '/admin',
    icon: ICONS.dashboard,
  },
  {
    name: 'Overview',
    type: 'anchor',
    targetId: 'overview',
    icon: ICONS.overview,
  },
  {
    name: 'Complaints',
    type: 'anchor',
    targetId: 'complaints',
    icon: ICONS.complaints,
  },
]

// Staff navigation links
export const staffNavLinks: NavLinkRoute[] = [
  {
    name: 'Dashboard',
    type: 'route',
    path: '/staff',
    icon: ICONS.dashboard,
  },
  {
    name: 'Active Tickets',
    type: 'route',
    path: '/staff/tickets/active',
    icon: ICONS.activeTicket,
  },
  {
    name: 'Pending Tickets',
    type: 'route',
    path: '/staff/tickets/pending',
    icon: ICONS.pendingTicket,
  },
  {
    name: 'Resolved Tickets',
    type: 'route',
    path: '/staff/tickets/resolved',
    icon: ICONS.resolvedTicket,
  },
]

// Student navigation links
export const studentNavLinks: NavLinkRoute[] = [
  {
    name: 'Dashboard',
    type: 'route',
    path: '/student',
    icon: ICONS.dashboard,
  },
  {
    name: 'Submit Complaint',
    type: 'route',
    path: '/student/submit',
    icon: ICONS.add,
  },
  {
    name: 'My Complaints',
    type: 'route',
    path: '/student/my-complaints',
    icon: ICONS.document,
  },
]
