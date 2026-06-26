import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../utils/contract";

export default function useWallet() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [role, setRole] = useState(null); // "owner" | "verifier" | "exporter" | "public"
  const [loading, setLoading] = useState(false);

  async function connect() {
    if (!window.ethereum) return alert("MetaMask tidak ditemukan!");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const ct = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Deteksi role
      const ownerAddress = await ct.owner();
      const isVerifier = await ct.isVerifier(address);
      const isExporter = await ct.isExporter(address);

      let detectedRole = "public";
      if (address.toLowerCase() === ownerAddress.toLowerCase()) detectedRole = "owner";
      else if (isVerifier) detectedRole = "verifier";
      else if (isExporter) detectedRole = "exporter";

      setAccount(address);
      setContract(ct);
      setRole(detectedRole);
    } catch (e) {
      alert("Gagal connect: " + e.message);
    }
    setLoading(false);
  }

  return { account, contract, role, loading, connect };
}