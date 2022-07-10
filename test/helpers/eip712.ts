export const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];

export const Agreement = [
  { name: 'active', type: 'address' },
  { name: 'passive', type: 'address' },
  { name: 'tokenURI', type: 'string' }
];
