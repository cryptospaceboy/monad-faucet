// Faucet Contract
export const FAUCET_CONTRACT_ADDRESS = '0x0E6ce2E679D54A0E0dACA2431D0370d559db9740';

// Paste your faucet ABI here
export const FAUCET_ABI = [
  // --- ABI START ---
  // Replace this array with the actual ABI from your compiled Faucet.json
  // Example:
  // {
  //   "inputs": [],
  //   "name": "claim",
  //   "outputs": [],
  //   "stateMutability": "nonpayable",
  //   "type": "function"
  // }
  // --- ABI END ---
];

// Faucet settings
export const CLAIM_AMOUNT = '0.02'; // MON to claim
export const CLAIM_INTERVAL_HOURS = 9; // Claim cooldown in hours

// Creator info (for clickable link in UI footer)
export const CREATOR_TWITTER_USERNAME = 'dattips_boy';
export const CREATOR_TWITTER_URL = `https://twitter.com/${CREATOR_TWITTER_USERNAME}`;