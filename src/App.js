import { useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [amount, setAmount] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask to continue.");
        return;
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletConnected(true);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet.");
    }
  };

  const buyTokens = async () => {
    try {
      if (!walletConnected) {
        toast.error("Connect your wallet first.");
        return;
      }
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        toast.error("Enter a valid amount.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const icoContract = new ethers.Contract(
        "0xa2458e4e2831da0b7c7fd1cf0ac9bf428d253474", // your ICO contract address
        [
          "function buyTokens() payable",
        ],
        signer
      );

      const tx = await icoContract.buyTokens({
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      toast.success("Tokens purchased successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Transaction failed. See console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center px-4">
      <h1 className="text-4xl font-bold mb-6">Buy HydraX (HDRX)</h1>
      <p className="text-gray-400 mb-8">Join the future of decentralized finance.</p>

      {!walletConnected ? (
        <button
          className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <input
            className="mb-4 px-4 py-3 rounded-lg text-black w-64"
            type="number"
            placeholder="Enter amount in POL"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
            onClick={buyTokens}
          >
            Buy HDRX
          </button>
        </>
      )}

      <ToastContainer />

      <footer className="text-gray-600 text-sm mt-12">
        © 2025 HydraX ICO Launch
      </footer>
    </div>
  );
}

export default App;
