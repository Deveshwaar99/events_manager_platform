import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="  flex-center w-full h-screen bg-primary-50 bg-dotted-pattern bg-cover bg-fixed bg-center">
      {children}
    </div>
  )
}
