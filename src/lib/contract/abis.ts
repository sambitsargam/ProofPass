// Smart contract types and ABIs

export const TICKET_NFT_ABI = [
  {
    inputs: [
      { name: 'eventId', type: 'string' },
      { name: 'to', type: 'address' },
      { name: 'credentialHash', type: 'bytes32' },
    ],
    name: 'mintTicket',
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'burnTicket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export const TICKET_MARKETPLACE_ABI = [
  {
    inputs: [
      { name: 'eventId', type: 'string' },
      { name: 'quantity', type: 'uint256' },
      { name: 'credentialHash', type: 'bytes32' },
    ],
    name: 'purchaseTickets',
    outputs: [{ name: 'ticketIds', type: 'uint256[]' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'eventId', type: 'string' }],
    name: 'getEventDetails',
    outputs: [
      { name: 'totalTickets', type: 'uint256' },
      { name: 'soldTickets', type: 'uint256' },
      { name: 'pricePerTicket', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'verifyTicket',
    outputs: [{ name: 'isValid', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
];
