'use client'

import { useState } from 'react'

/**
 * Issuer Dashboard - Credential Issuance
 * Admin panel for event organizers to issue credentials
 */
export default function IssuerDashboard() {
  const [activeTab, setActiveTab] = useState('issue')
  const [formData, setFormData] = useState({
    recipientAddress: '',
    credentialType: 'HUMAN_VERIFIED',
    userName: '',
    email: '',
    verificationMethod: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [issuedCredentials, setIssuedCredentials] = useState<any[]>([])
  const [analytics, setAnalytics] = useState({
    totalIssued: 0,
    activeCredentials: 0,
    verifiedUsers: 0,
    successRate: 100,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleIssueCredential = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage(null)

    try {
      // Validate form
      if (!formData.recipientAddress || !formData.userName || !formData.email) {
        throw new Error('Please fill in all required fields')
      }

      // Call real credential issuance API
      const response = await fetch('/api/credentials/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientAddress: formData.recipientAddress,
          credentialType: formData.credentialType,
          userName: formData.userName,
          email: formData.email,
          verificationMethod: formData.verificationMethod,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to issue credential')
      }

      const result = await response.json()

      // Add to issued credentials list
      setIssuedCredentials((prev) => [
        ...prev,
        {
          id: result.credentialId,
          recipient: formData.recipientAddress,
          type: formData.credentialType === 'HUMAN_VERIFIED' ? 'Human Verified' : 'Fan Badge (VIP)',
          issued: new Date().toLocaleDateString(),
          status: 'Active',
        },
      ])

      // Update analytics
      setAnalytics((prev) => ({
        ...prev,
        totalIssued: prev.totalIssued + 1,
        activeCredentials: prev.activeCredentials + 1,
        verifiedUsers: prev.verifiedUsers + 1,
      }))

      setSuccessMessage(
        `✅ Credential issued successfully!\nID: ${result.credentialId}`
      )
      setFormData({
        recipientAddress: '',
        credentialType: 'HUMAN_VERIFIED',
        userName: '',
        email: '',
        verificationMethod: '',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to issue credential'
      alert(message)
      console.error('Issuance error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-20 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">Issuer Dashboard</h1>
        <p className="text-gray-400 text-lg">
          Issue verifiable credentials to prove humanity and fan status.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('issue')}
          className={`pb-4 px-4 font-semibold transition ${
            activeTab === 'issue'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Issue Credential
        </button>
        <button
          onClick={() => setActiveTab('issued')}
          className={`pb-4 px-4 font-semibold transition ${
            activeTab === 'issued'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Issued Credentials
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 px-4 font-semibold transition ${
            activeTab === 'analytics'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Issue Tab */}
      {activeTab === 'issue' && (
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">New Credential</h2>

            {successMessage && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500 text-green-400 mb-6">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleIssueCredential} className="space-y-6">
              {/* Credential Type */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Credential Type
                </label>
                <select
                  name="credentialType"
                  value={formData.credentialType}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="HUMAN_VERIFIED">Human Verified</option>
                  <option value="FAN_BADGE">Fan Badge (VIP)</option>
                  <option value="FAN_BADGE_GOLD">Fan Badge (Gold)</option>
                </select>
              </div>

              {/* Recipient Address */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Recipient Wallet Address
                </label>
                <input
                  type="text"
                  name="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="input-field"
                  required
                />
              </div>

              {/* User Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  User Name
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                  className="input-field"
                  required
                />
              </div>

              {/* Verification Method */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Verification Method
                </label>
                <select
                  name="verificationMethod"
                  value={formData.verificationMethod}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select method</option>
                  <option value="MANUAL">Manual Verification</option>
                  <option value="BIOMETRIC">Biometric (Face ID)</option>
                  <option value="PHONE">Phone Verification</option>
                  <option value="EMAIL">Email Verification</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 text-lg font-semibold"
              >
                {isSubmitting ? 'Issuing...' : 'Issue Credential'}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Human Verified</h3>
              <p className="text-gray-400 mb-4">
                Proves the holder is a real human. Prevents bots from ticket purchases.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>✓ Biometric verification</p>
                <p>✓ Phone verification</p>
                <p>✓ No personal data stored</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4">Fan Badge (VIP)</h3>
              <p className="text-gray-400 mb-4">
                Exclusive credential for loyal fans. Unlocks VIP perks and early access.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>✓ Loyalty tracking</p>
                <p>✓ Exclusive benefits</p>
                <p>✓ Transferable across events</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issued Tab */}
      {activeTab === 'issued' && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Issued Credentials</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">Recipient</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Issued</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {issuedCredentials.length > 0 ? (
                issuedCredentials.map((cred, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-gray-800/50 transition"
                  >
                    <td className="py-3 px-4 font-mono text-primary">
                      {cred.recipient}
                    </td>
                    <td className="py-3 px-4">{cred.type}</td>
                    <td className="py-3 px-4">{cred.issued}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400">
                        {cred.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No credentials issued yet. Start issuing credentials above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Issued', value: analytics.totalIssued.toString(), icon: '📋' },
            { label: 'Active Credentials', value: analytics.activeCredentials.toString(), icon: '✅' },
            { label: 'Verified Users', value: analytics.verifiedUsers.toString(), icon: '👥' },
            { label: 'Success Rate', value: analytics.successRate + '%', icon: '📊' },
          ].map((stat, idx) => (
            <div key={idx} className="card text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
              <div className="text-3xl font-bold mt-2">{stat.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
