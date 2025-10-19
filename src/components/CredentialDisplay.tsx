'use client'

/**
 * Credential Display Component
 */
export function CredentialDisplay({ credential }: { credential: any }) {
  // Format the issued date - handle both timestamp and ISO string formats
  const formatDate = (date: any): string => {
    if (!date) return 'N/A'
    try {
      const dateObj = typeof date === 'number' ? new Date(date * 1000) : new Date(date)
      return dateObj.toLocaleDateString()
    } catch {
      return 'N/A'
    }
  }

  // Determine credential type and display name
  const getCredentialDisplay = (type: string) => {
    if (type?.toUpperCase().includes('HUMAN') || type?.toUpperCase().includes('KYC')) {
      return '✅ Human Verified'
    }
    if (type?.toUpperCase().includes('FAN') || type?.toUpperCase().includes('BADGE')) {
      return '🎭 Fan Badge'
    }
    return `${type}`
  }

  // Get holder address from various possible fields
  const getHolderAddress = () => {
    return (
      credential.holderAddress ||
      credential.holder ||
      credential.abstractAccountAddress ||
      'Unknown'
    )
  }

  const holderAddr = getHolderAddress()
  const displayAddress = typeof holderAddr === 'string' && holderAddr.length > 10 
    ? `${holderAddr.slice(0, 6)}...${holderAddr.slice(-4)}`
    : holderAddr

  return (
    <div className="card border-l-4 border-primary">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{getCredentialDisplay(credential.type)}</h3>
          <p className="text-gray-400 text-sm mt-1">
            Issued by {credential.issuer || credential.issuerDid || 'AIR Kit'}
          </p>
        </div>
        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold">
          {credential.status?.toUpperCase() || 'Active'}
        </span>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Holder:</span>
          <span className="font-mono">{displayAddress}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Issued:</span>
          <span>{formatDate(credential.issuedAt)}</span>
        </div>
        {credential.expiresAt && (
          <div className="flex justify-between">
            <span className="text-gray-400">Expires:</span>
            <span>{formatDate(credential.expiresAt)}</span>
          </div>
        )}
        {credential.id && (
          <div className="flex justify-between">
            <span className="text-gray-400">ID:</span>
            <span className="font-mono text-xs">{credential.id.slice(0, 12)}...</span>
          </div>
        )}
      </div>
    </div>
  )
}


