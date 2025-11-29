import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gray-600 shadow-sm border-b border-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold ">
                Agency Dashboard
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link 
                  href="/agencies" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Agencies
                </Link>
                <Link 
                  href="/contacts" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Contacts
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-600 border-t border-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-300">
            © 2025 Agency Dashboard.
          </p>
        </div>
      </footer>
    </div>
  )
}
