import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center border-2 border-navy-300">
              <span className="text-navy-700 font-bold text-xs">PH</span>
            </div> */}
            {/* <p className="text-sm text-gray-600">
              Barangay R.M. Tan
            </p> */}
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Barangay R.M. Tan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}