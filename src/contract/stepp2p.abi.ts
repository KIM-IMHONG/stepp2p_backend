export const STEPP2P_ABI = [
  {
    name: 'sellerSales',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'seller', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }],
  },
  {
    name: 'sales',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'saleId', type: 'uint256' }],
    outputs: [
      { name: 'seller', type: 'address' },
      { name: 'totalAmount', type: 'uint256' },
      { name: 'remaining', type: 'uint256' },
      { name: 'active', type: 'bool' },
    ],
  },
  {
    name: 'createSaleOrder',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_amount', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'purchase',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_saleId', type: 'uint256' },
      { name: '_amount', type: 'uint256' },
      { name: 'buyer', type: 'address' },
    ],
    outputs: [],
  },
  {
    name: 'cancelSaleOrder',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_saleId', type: 'uint256' }],
    outputs: [],
  },
]
