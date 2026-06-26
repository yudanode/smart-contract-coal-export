import { useState } from "react";
import VerifierDashboard from "./VerifierDashboard";

export default function OwnerDashboard({ contract, account }) {
  const [tab, setTab] = useState("records");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAction(action) {
    if (!address) return setStatus({ type: "error", msg: "Masukkan wallet address!" });
    setLoading(true);
    setStatus({ type: "info", msg: "⏳ Memproses..." });
    try {
      let tx;
      if (action === "addVerifier") tx = await contract.addVerifier(address);
      if (action === "removeVerifier") tx = await contract.removeVerifier(address);
      if (action === "addExporter") tx = await contract.addExporter(address);
      if (action === "removeExporter") tx = await contract.removeExporter(address);
      await tx.wait();
      setStatus({ type: "success", msg: `✅ Berhasil!` });
      setAddress("");
    } catch (e) {
      setStatus({ type: "error", msg: "❌ " + e.message });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        {[
          { key: "records", label: "📊 Semua Record" },
          { key: "manage", label: "⚙️ Kelola Akses" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === t.key ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "records" && <VerifierDashboard contract={contract} account={account} />}

      {tab === "manage" && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">⚙️ Kelola Akses Role</h2>
          {status && (
            <div className={`text-sm p-3 rounded-lg mb-4 ${
              status.type === "success" ? "bg-emerald-900 text-emerald-300" :
              status.type === "error" ? "bg-red-900 text-red-300" :
              "bg-blue-900 text-blue-300"
            }`}>{status.msg}</div>
          )}
          <div className="mb-4">
            <label className="text-xs text-slate-400 mb-1 block">Wallet Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { action: "addVerifier", label: "➕ Tambah Verifikator", color: "bg-blue-700 hover:bg-blue-600" },
              { action: "removeVerifier", label: "➖ Hapus Verifikator", color: "bg-red-800 hover:bg-red-700" },
              { action: "addExporter", label: "➕ Tambah Eksportir", color: "bg-green-700 hover:bg-green-600" },
              { action: "removeExporter", label: "➖ Hapus Eksportir", color: "bg-red-800 hover:bg-red-700" },
            ].map((btn) => (
              <button
                key={btn.action}
                onClick={() => handleAction(btn.action)}
                disabled={loading}
                className={`${btn.color} disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}