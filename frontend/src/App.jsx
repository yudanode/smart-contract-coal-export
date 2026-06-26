import { useState } from "react";
import useWallet from "./hooks/useWallet";
import OwnerDashboard from "./components/OwnerDashboard";
import VerifierDashboard from "./components/VerifierDashboard";
import ExporterDashboard from "./components/ExporterDashboard";
import PublicDashboard from "./components/PublicDashboard";

export default function App() {
  const { account, contract, role, loading, connect } = useWallet();

  const roleLabel = {
    owner: { text: "Owner — DGCE", color: "bg-purple-600" },
    verifier: { text: "Verifikator", color: "bg-blue-600" },
    exporter: { text: "Eksportir", color: "bg-green-600" },
    public: { text: "Publik", color: "bg-gray-600" },
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-sky-400">⛏ VERICOAL</h1>
            <p className="text-xs text-slate-400">Sistem Verifikasi Harga Ekspor Batu Bara</p>
          </div>
          <div className="flex items-center gap-3">
            {account && role && (
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${roleLabel[role].color}`}>
                {roleLabel[role].text}
              </span>
            )}
            {account ? (
              <span className="text-xs text-slate-400 bg-slate-700 px-3 py-2 rounded-lg">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            ) : (
              <button
                onClick={connect}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                {loading ? "Connecting..." : "🔗 Connect MetaMask"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {!account ? (
          // Landing page sebelum connect
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-6">⛏</div>
            <h2 className="text-3xl font-bold text-sky-400 mb-3">VERICOAL</h2>
            <p className="text-slate-400 max-w-md mb-8">
              Sistem verifikasi harga ekspor batu bara berbasis blockchain Ethereum.
              Transparan, immutable, dan tidak bisa dimanipulasi.
            </p>
            <button
              onClick={connect}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition text-lg"
            >
              {loading ? "Menghubungkan..." : "🔗 Connect MetaMask untuk Mulai"}
            </button>
            <div className="mt-12 grid grid-cols-3 gap-6 text-left max-w-2xl">
              {[
                { icon: "🏭", title: "Eksportir", desc: "Submit harga batu bara ke blockchain" },
                { icon: "🏛", title: "DGCE / Verifikator", desc: "Verifikasi harga sesuai referensi HDMA" },
                { icon: "🌐", title: "Publik", desc: "Pantau transparansi harga secara real-time" },
              ].map((item) => (
                <div key={item.title} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-semibold text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-slate-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Dashboard berdasarkan role
          <>
            {role === "owner" && <OwnerDashboard contract={contract} account={account} />}
            {role === "verifier" && <VerifierDashboard contract={contract} account={account} />}
            {role === "exporter" && <ExporterDashboard contract={contract} account={account} />}
            {role === "public" && <PublicDashboard contract={contract} account={account} />}
          </>
        )}
      </main>
    </div>
  );
}