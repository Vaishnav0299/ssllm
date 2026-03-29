"use client"

import { useState } from "react"
import { ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { AIChatbot } from "@/components/ui/chatbot"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar — always rendered on desktop, drawer on mobile */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
      <AIChatbot />
    </div>
  )
}
