import { useState, useEffect } from 'react';
import { FAUCET_CONTRACT_ADDRESS, FAUCET_ABI } from './config/config.js';

function App() {
  const [address, setAddress] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [timer, setTimer] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Backend URL from .env
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Check cooldown from backend
  const checkCooldown = async (addr) => {
    if (!addr) return;
    try {
      const res = await fetch(`${BACKEND_URL}/cooldown`, {
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
      setStatus("❌ Failed to check cooldown");
    }
  };

  // Claim faucet
  const claimFaucet = async () => {
    if (!address) {
      setStatus('❌ Please enter a wallet address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(`✅ Claim successful! Tx: ${data.txHash}`);
        checkCooldown(address);
      } else {
        setStatus(`❌ Claim failed: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Claim failed: Unknown error');
    }
    setLoading(false);
  };

  // Countdown effect
  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            checkCooldown(address);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown, address]);

  // Format seconds -> HH:MM:SS
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
    <div className="app-container" style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>💧 Monad Testnet Faucet</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your wallet address"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            width: "100%",
          }}
        />
        {cooldown === 0 ? (
          <button
            onClick={claimFaucet}
            disabled={loading}
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: "#6a0dad",
              color: "white",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              width: "100%",
            }}
          >
            {loading ? "Claiming..." : "Claim 0.05 MON"}
          </button>
        ) : (
          <p style={{ textAlign: "center" }}>⏳ Next claim in {timer}</p>
        )}
      </div>

      {status && <p style={{ textAlign: "center", color: status.startsWith("✅") ? "green" : "red" }}>{status}</p>}

      <div
        style={{marginTop: "20px",
          padding: "15px",
          background: "linear-gradient(90deg, #6a0dad, #00c6ff)",
          color: "white",
          borderRadius: "8px",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        💡 Built for the Monad Testnet — Works on PC & mobile!
      </div>
    </div>
  );
}

export default App;