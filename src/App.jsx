import { useState, useEffect } from 'react';
import { FAUCET_CONTRACT_ADDRESS, FAUCET_ABI } from './config/config.js'; // ✅ fixed import path

function App() {
  const [address, setAddress] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [timer, setTimer] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Check cooldown from backend via proxy
  const checkCooldown = async (addr) => {
    try {
      const res = await fetch(`/api/cooldown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addr }),
      });
      const data = await res.json();
      if (data.nextClaim) {
        const now = Math.floor(Date.now() / 1000);
        const diff = Number(data.nextClaim) - now;
        setCooldown(diff > 0 ? diff : 0);
      }
    } catch (err) {
      console.error("Cooldown check failed:", err);
      setStatus('❌ Failed to fetch cooldown');
    }
  };

  // ✅ Claim via backend via proxy
  const claimFaucet = async () => {
    if (!address) {
      setStatus('❌ Please enter a wallet address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(`✅ Claim successful! Tx: ${data.txHash}`);
        checkCooldown(address); // refresh cooldown
      } else {
        setStatus(`❌ Claim failed: ${data.error}`);
      }
    } catch (err) {
      console.error("Claim failed:", err);
      let msg = "Claim failed: Unknown error";
      if (err && err.message) msg = "Claim failed: " + err.message;
      setStatus(msg);
    }
    setLoading(false);
  };

  // ⏳ live countdown effect
  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            checkCooldown(address); // auto-refresh
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown, address]);

  // format seconds -> HH:MM:SS
  useEffect(() => {
    if (cooldown > 0) {
      const hours = Math.floor(cooldown / 3600);
      const minutes = Math.floor((cooldown % 3600) / 60);
      const seconds = cooldown % 60;
      setTimer(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    } else {
      setTimer('');
    }
  }, [cooldown]);

  return (
    <div className="app-container">
      <h1>💧 Monad Testnet Faucet</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your wallet address"
          style={{
            width: "70%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            marginRight: "10px",
          }}
        />
        {cooldown === 0 ? (
          <button onClick={claimFaucet} disabled={loading}>
            {loading ? 'Claiming...' : 'Claim 0.05 MON'}
          </button>
        ) : (
          <p>⏳ Next claim available in {timer}</p>
        )}
      </div>

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
      >💡 Built for the Monad Testnet — Have fun testing and happy claiming!
      </div>

      {/* A-Ads Banner */}
      <div 
        id="frame"
        style={{ 
          width: "100%", margin: "20px auto 0 auto", 
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