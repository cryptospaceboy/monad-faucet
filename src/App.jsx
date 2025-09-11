import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { FAUCET_CONTRACT_ADDRESS, FAUCET_ABI } from './config/config';

function App() {
  const [wallet, setWallet] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ v6 connectWallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        setWallet(await signer.getAddress());
      } catch (err) {
        console.error(err);
      }
    } else {
      alert('Please install MetaMask to use this DApp');
    }
  };

  // ✅ v6 checkCooldown
  const checkCooldown = async () => {
    if (!wallet) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(FAUCET_CONTRACT_ADDRESS, FAUCET_ABI, provider);
    const nextTime = await contract.nextClaimTime(wallet);
    const now = Math.floor(Date.now() / 1000);
    const diff = Number(nextTime) - now;
    setCooldown(diff > 0 ? diff : 0);
  };

  // ✅ v6 claimFaucet
  const claimFaucet = async () => {
    if (!wallet) {
      setStatus('❌ Please connect your wallet first.');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FAUCET_CONTRACT_ADDRESS, FAUCET_ABI, signer);

      const tx = await contract.claim();
      await tx.wait();
      setStatus('✅ Claim successful! 0.05 MON sent to your wallet.');
    } catch (err) {
      console.error(err);
      setStatus('❌ Claim failed: ' + (err.reason || err.message));
    }
    setLoading(false);
    checkCooldown();
  };

  useEffect(() => {
    if (wallet) {
      checkCooldown();
    }
  }, [wallet]);

  return (
    <div className="app-container">
      <h1>💧 Monad Testnet Faucet</h1>
      <p>Connected Wallet: {wallet || 'Not connected'}</p>

      {!wallet && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}

      {wallet && cooldown > 0 && (
        <p>⏳ You can claim again in {Math.ceil(cooldown / 3600)} hours.</p>
      )}

      {wallet && cooldown === 0 && (
        <button onClick={claimFaucet} disabled={loading}>
          {loading ? 'Claiming...' : 'Claim 0.05 MON'}
        </button>
      )}

      {status && <p className="status">{status}</p>}

      <a
        href="https://twitter.com/dattips_boy"
        target="_blank"
        rel="noopener noreferrer"
        className="twitter-link"
      >
        Created by @dattips_boy
      </a>

      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          background: 'linear-gradient(90deg, #6a0dad, #00c6ff)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '14px',
          textAlign: 'center',
        }}
      >
       💡 Built for the Monad Testnet — Have fun testing and happy claiming!
      </div>

      {/* A-Ads Banner */}
      <div 
        id="frame" 
        style={{ 
          width: "100%", 
          margin: "20px auto 0 auto", 
          background: "rgba(0, 0, 0, 0.35)",
          position: "relative", 
          zIndex: 99998, 
          textAlign: "center", 
          padding: "10px 0", 
          borderRadius: "8px"
        }}
      >
        <iframe
          data-aa="2406854"
          src="//acceptable.a-ads.com/2406854/?size=Adaptive"
          style={{ 
            border: 0, 
            padding: 0, 
            width: "70%", 
            height: "auto", 
            overflow: "hidden", 
            display: "block", 
            margin: "auto" 
          }}
          title="A-Ads"
        ></iframe>
      </div>

    </div>
  );
}

export default App;