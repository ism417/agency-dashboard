'use client'

import { useEffect, useState, useRef } from 'react'

interface Contact {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
  title: string | null
  emailType: string | null
  contactFormUrl: string | null
  department: string | null
  agencyId: string | null
  firmId: string | null
  agency: {
    name: string
  } | null
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalContacts, setTotalContacts] = useState(0)
  const [viewedPages, setViewedPages] = useState<number[]>([])
  const [allTimeViewedPages, setAllTimeViewedPages] = useState<number[]>([])
  const [limitReached, setLimitReached] = useState(false)
  const hasFetched = useRef(false)
  
  const fetchContacts = (page: number) => {
    setLoading(true)
    setError(null)
    fetch(`/api/contacts?page=${page}`)
      .then(re => {
        if (re.status === 429) {
          return re.json().then(data => {
            throw new Error(data.error || 'Daily limit reached')
          })
        }
        if (!re.ok) {
          throw new Error('Failed to fetch contacts')
        }
        return re.json()
      })
      .then(data => {
        setContacts(data.contacts || [])
        setTotalPages(data.totalPages || 1)
        setTotalContacts(data.totalContacts || 0)
        setCurrentPage(data.currentPage || 1)
        setViewedPages(data.viewedPages || [])
        setAllTimeViewedPages(data.allTimeViewedPages || [])
        setLimitReached(false)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLimitReached(err.message.includes('limit'))
        setLoading(false)
      })
  }
  
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      fetchContacts(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading contacts...</div>
      </div>
    )
  }
  
  if (error && limitReached) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="bg-yellow-50 w-2xl border border-yellow-200 rounded-lg p-6 flex flex-col items-center gap-2">
          <h2 className=" text-xl font-semibold text-yellow-900">Daily Limit Reached</h2>
          <button className='bg-yellow-900 p-2 font-semibold rounded-xl hover:bg-amber-600' > Upgrade</button>
          <p className='text-gray-500' > Upgrade to premuim to unlock more than 50 contacts per day</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 ">
      <div className="flex justify-between mb-4 w-full">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <div className="text-sm text-gray-300">
          Total: {totalContacts}
        </div>
      </div>
      {contacts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No contacts found</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Form
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agency
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : (contact.firstName || contact.lastName || '—')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {contact.title || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {contact.email || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {contact.emailType || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {contact.phone || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {contact.department || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {contact.contactFormUrl ? (
                        <a href={contact.contactFormUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Form
                        </a>
                      ) : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {contact.agency?.name || '—'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {contacts.length > 0 && (
        <>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalContacts)} of {totalContacts} contacts
          </div>
          
          <div className="mt-6 bg-white shadow-md rounded-lg p-4">
            <div className="flex gap-1 p-1 overflow-x-auto">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                const isViewedThisHour = viewedPages.includes(page)
                const isViewedAllTime = allTimeViewedPages.includes(page)
                return (
                  <button
                    key={page}
                    onClick={() => fetchContacts(page)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md text-sm font-medium relative ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : isViewedAllTime
                        ? 'border border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                        : isViewedThisHour
                        ? 'border border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                        : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={
                      isViewedAllTime 
                        ? "Previously viewed (won't count against limit)" 
                        : isViewedThisHour 
                        ? "Viewed this hour" 
                        : "Not yet viewed"
                    }
                  >
                    {page}
                    {isViewedAllTime && page !== currentPage && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white" />
                    )}
                    {isViewedThisHour && !isViewedAllTime && page !== currentPage && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-yellow-400 ring-2 ring-white" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
