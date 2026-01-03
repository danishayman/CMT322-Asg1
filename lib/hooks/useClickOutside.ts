'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Hook that handles clicks outside of the specified element
 * @param ref - Reference to the element to detect outside clicks
 * @param handler - Callback function to execute when clicking outside
 * @param enabled - Whether the hook is enabled (default: true)
 * @param excludeSelector - Optional selector for elements to exclude from triggering the handler
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled: boolean = true,
  excludeSelector?: string
) {
  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if click is inside the ref element
      if (ref.current && ref.current.contains(target)) {
        return
      }

      // Check if click is on an excluded element
      if (excludeSelector) {
        const excludedElement = document.querySelector(excludeSelector)
        if (excludedElement && excludedElement.contains(target)) {
          return
        }
      }

      handler()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, handler, enabled, excludeSelector])
}

/**
 * Hook specifically for sidebar collapse behavior
 * Only triggers on desktop (>= 1024px) when sidebar is expanded
 */
export function useSidebarClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  onCollapse: () => void,
  isCollapsed: boolean
) {
  useClickOutside(
    ref,
    () => {
      if (window.innerWidth >= 1024) {
        onCollapse()
      }
    },
    !isCollapsed, // Only enabled when sidebar is expanded
    '[aria-label="Toggle sidebar"]' // Exclude the toggle button
  )
}
