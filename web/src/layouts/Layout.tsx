import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-white text-xl font-bold">
                🛡️ SOC Monitor
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </a>
              <a href="/reports" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                Reportes
              </a>
              <a href="/users" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                Usuarios
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 SOC Monitor Advanced - v2.0.0</p>
        </div>
      </footer>
    </div>
  );
}
