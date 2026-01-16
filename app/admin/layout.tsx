"use client"

import { createContext, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { signOut } from "@/lib/actions/auth"

type AdminSectionKey = "overview" | "complaints" | "reviews"

type NavLink =
  | {
    name: string
    type: "route"
    path: string
    icon: string
  }
  | {
    name: string
    type: "anchor"
    targetId: AdminSectionKey
    icon: string
  }

export const AdminSectionContext = createContext<{
  activeSection: AdminSectionKey
  setActiveSection: (section: AdminSectionKey) => void
}>({
  activeSection: "overview",
  setActiveSection: () => undefined,
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState<AdminSectionKey>("overview")
  const sidebarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!pathname.startsWith("/admin")) {
      return
    }
    if (pathname === "/admin") {
      setActiveSection("overview")
    }
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 1024 || isCollapsed) {
        return
      }
      const target = event.target as Node
      if (sidebarRef.current && !sidebarRef.current.contains(target)) {
        const toggleButton = document.querySelector(
          '[aria-label="Toggle sidebar"]',
        )
        if (!toggleButton || !toggleButton.contains(target)) {
          setIsCollapsed(true)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCollapsed])

  const navLinks: NavLink[] = useMemo(
    () => [
      {
        name: "Dashboard",
        type: "route",
        path: "/admin",
        icon:
          "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      },
      {
        name: "Overview",
        type: "anchor",
        targetId: "overview",
        icon: "M13 10V3L4 14h7v7l9-11h-7z",
      },
      {
        name: "Complaints",
        type: "anchor",
        targetId: "complaints",
        icon: "M12 20h9M12 4h9m-9 8h9M3 7h6v10H3z",
      },
      {
        name: "Reviews",
        type: "route",
        path: "/admin/reviews",
        icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
      },
    ],
    [],
  )

  const handleLogout = async () => {
    toast.success("Signed Out");
    await signOut();
  }

  const isLinkActive = (link: NavLink) => {
    if (link.type === "route") {
      return pathname === link.path
    }
    return activeSection === link.targetId
  }

  const handleNavClick = (link: NavLink) => {
    if (link.type === "route") {
      router.push(link.path)
      setActiveSection("overview")
    } else {
      setActiveSection(link.targetId)
      requestAnimationFrame(() => {
        const element = document.getElementById(link.targetId)
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      })
    }
    setIsSidebarOpen(false)
  }

  return (
    <AdminSectionContext.Provider value={{ activeSection, setActiveSection }}>
      <div className="min-h-screen bg-gray-50">
        <nav className="fixed top-0 z-30 h-16 w-full border-b border-gray-200 bg-white shadow-sm">
          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6 flex-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden rounded-lg p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 lg:block"
              aria-label="Toggle sidebar"
            >
              <div className="flex">
                <svg
                  className="h-6 w-6 flex-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isCollapsed
                        ? "M13 5l7 7-7 7M5 5l7 7-7 7"
                        : "M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    }
                  />
                </svg>
                <h1 className="flex-none pl-4">Navigation</h1>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
                USM Hostel <span className="text-[#5e2a84]">|</span>{" "}
                <span className="font-normal text-gray-600">Admin Portal</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5e2a84] text-sm font-medium text-white shadow-sm transition-shadow duration-200 hover:shadow-md">
                A
              </div>
            </div>
          </div>
        </nav>

        <aside
          ref={sidebarRef}
          className={`fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] transform border-r border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 ${isCollapsed ? "lg:w-20 lg:cursor-pointer" : "lg:w-64"
            }`}
          onClick={(event) => {
            if (
              isCollapsed &&
              window.innerWidth >= 1024 &&
              !(event.target as HTMLElement).closest("button")
            ) {
              setIsCollapsed(false)
            }
          }}
        >
          <div className="flex h-full flex-col p-4">
            <nav className="flex-1 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${isLinkActive(link)
                    ? "bg-[#5e2a84] text-white shadow-md"
                    : "text-gray-700 hover:bg-purple-50 hover:text-[#5e2a84]"
                    } ${isCollapsed ? "lg:justify-center" : ""}`}
                  title={isCollapsed ? link.name : ""}
                >
                  <svg
                    className="h-5 w-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={link.icon}
                    />
                  </svg>
                  <span className={isCollapsed ? "lg:hidden" : ""}>
                    {link.name}
                  </span>
                </button>
              ))}
            </nav>

            <button
              onClick={handleLogout}
              className={`mt-auto flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${isCollapsed ? "lg:justify-center" : ""
                }`}
              title={isCollapsed ? "Logout" : ""}
            >
              <svg
                className="h-5 w-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className={isCollapsed ? "lg:hidden" : ""}>Logout</span>
            </button>
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 top-16 z-10 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden"
          />
        )}

        <main
          className={`min-h-screen pt-16 transition-all duration-300 ease-in-out ${isCollapsed ? "lg:pl-20" : "lg:pl-64"
            }`}
        >
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </AdminSectionContext.Provider>
  )
}

