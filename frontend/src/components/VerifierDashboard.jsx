import { useState, useEffect } from "react";
import { RecordCard } from "./PublicDashboard";

function StatCard({ label, value, color }) {
  return (
    <div className={`bg-slate-800 border ${color} rounded-xl p-4 text-center`}>
      <div className="text-3xl font-bold text-slate-100">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}

export default function VerifierDashboard({ contract, account }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => { if (contract) loadRecords(); }, [contract]);

  async function loadRecords() {
    setLoading(true);
    try {
      const count = await contract.recordCount();
      const data = [];
      for (let i = 1; i <= Number(count); i++) {
        const r = await contract.getRecord(i);
        data.push(r);
      }
      setRecords(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function handleVerify(id) {
    const remarks = prompt("Catatan verifikasi (contoh: Sesuai HDMA Juni 2026):");
    if (!remarks) return;
    setStatus({ type: "info", msg: "⏳ Memverifikasi..." });
    try {
      const tx = await contract.verifyPrice(id, remarks);
      await tx.wait();
      setStatus({ type: "success", msg: `✅ Record #${id} berhasil diverifikasi!` });
      loadRecords();
    } catch (e) {
      setStatus({ type: "error", msg: "❌ " + e.message });
    }
  }

  const unverified = records.filter(r => !r.verified);
  const verified = records.filter(r => r.verified);
  const flagged = records.filter(r => r.flagged);

  return (
    <div className="space-y-6">

      {/* Statistik Ringkasan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Record"
          value={records.length}
          color="border-slate-600"
        />
        <StatCard
          label="Sudah Diverifikasi"
          value={verified.length}
          color="border-emerald-700"
        />
        <StatCard
          label="Menunggu Verifikasi"
          value={unverified.length}
          color="border-amber-700"
        />
        <StatCard
          label="Fraud Alert"
          value={flagged.length}
          color="border-red-700"
        />
      </div>

      {/* Status Message */}
      {status && (
        <div className={`text-sm p-3 rounded-lg ${
          status.type === "success" ? "bg-emerald-900 text-emerald-300" :
          status.type === "error" ? "bg-red-900 text-red-300" :
          "bg-blue-900 text-blue-300"
        }`}>{status.msg}</div>
      )}

      {/* Fraud Alert Section */}
      {flagged.length > 0 && (
        <div className="bg-red-950 border border-red-800 rounded-xl p-4">
          <h2 className="text-red-400 font-bold mb-3">🚨 Fraud Alert ({flagged.length} record mencurigakan)</h2>
          <div className="grid gap-3">
            {flagged.map((r, i) => (
              <div key={i} className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">#{Number(r.id)} — {r.exporter}</span>
                  <span className="text-fuchsia-400 font-bold">${(Number(r.priceUSDCents)/100).toFixed(2)}/ton</span>
                </div>
                <div className="text-red-300 mt-1">⚠️ {r.flagReason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menunggu Verifikasi */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">⏳ Menunggu Verifikasi ({unverified.length})</h2>
          <button
            onClick={loadRecords}
            className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition"
          >
            🔄 Refresh
          </button>
        </div>
        {loading ? (
          <div className="text-slate-400 text-sm">Memuat data dari blockchain...</div>
        ) : unverified.length === 0 ? (
          <div className="text-slate-400 text-sm bg-slate-800 rounded-xl p-4 text-center">
            ✅ Semua record sudah diverifikasi.
          </div>
        ) : (
          <div className="grid gap-4">
            {unverified.map((r, i) => (
              <RecordCard key={i} record={r} onVerify={handleVerify} />
            ))}
          </div>
        )}
      </div>

      {/* Sudah Diverifikasi */}
      <div>
        <h2 className="text-lg font-bold mb-4">✅ Sudah Diverifikasi ({verified.length})</h2>
        {verified.length === 0 ? (
          <div className="text-slate-400 text-sm bg-slate-800 rounded-xl p-4 text-center">
            Belum ada record yang diverifikasi.
          </div>
        ) : (
          <div className="grid gap-4">
            {verified.map((r, i) => <RecordCard key={i} record={r} />)}
          </div>
        )}
      </div>

    </div>
  );
}