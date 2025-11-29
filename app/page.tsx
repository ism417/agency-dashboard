import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { IoIosContacts } from "react-icons/io";
import { BsBuildings } from "react-icons/bs";


import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SignedOut>
          <div className="text-center py-20">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to Agency Dashboard
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Manage your agencies and contacts in one place. Access up to 50 contact views per day.
            </p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-colors text-lg">
                Sign In to Get Started
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn >
          <div className="py-12 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-8 text-white">
              Dashboard
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Link href="/agencies">
                <div className="bg-gray-500 rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <BsBuildings color='blue' size="28"/>
                    </div>
                    <h2 className="text-2xl font-semibold text-white ml-4">Agencies</h2>
                  </div>
                </div>
              </Link>
              <Link href="/contacts">
                <div className="bg-gray-500 rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-500">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <IoIosContacts color='blue' size="28" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white ml-4">Contacts</h2>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
