import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-50 to-navy-100 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-navy-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">BRM</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-900">Reset Password</h1>
          <p className="text-gray-600">We'll send you reset instructions</p>
        </div>

        {submitted ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Check your email for reset instructions
            </p>
            <Link to="/login">
              <Button variant="outline">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>

            <p className="text-center text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-navy-700 hover:text-navy-800 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </Card>
    </div>
  )
}