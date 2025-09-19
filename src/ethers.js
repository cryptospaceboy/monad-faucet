import { ethers as ethers6 } from "ethers";

// Try to detect ethers major version
let ethersVersion = 6;
try {
  const { version } = ethers6;
  if (version && version.startsWith("5.")) {
    ethersVersion = 5;
  }
} catch {
  ethersVersion = 6;
}

export function getProvider() {
  if (!window.ethereum) throw new Error("No wallet provider found");

  if (ethersVersion === 5) {
    // v5 style
    return new ethers6.providers.Web3Provider(window.ethereum);
  } else {
    // v6 style
    return new ethers6.BrowserProvider(window.ethereum);
  }
}

export async function getSigner() {
  const provider = getProvider();
  if (ethersVersion === 5) {
    return provider.getSigner();
  } else {
    return await provider.getSigner();
  }
}