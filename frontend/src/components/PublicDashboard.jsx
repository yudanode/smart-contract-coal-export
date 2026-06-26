import { useState, useEffect } from "react";

export default function PublicDashboard({ contract }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contract) loadRecords();
  }, [contract]);

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
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-100">📊 Data Harga Batu Bara</h2>
        <button
          onClick={loadRecords}
          className="text-sm bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Memuat data dari blockchain...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 text-slate-400">Belum ada data.</div>
      ) : (
        <div className="grid gap-4">
          {records.map((r, i) => (
            <RecordCard key={i} record={r} />
          ))}
        </div>
      )}
    </div>
  );
}

export function RecordCard({ record: r, onVerify }) {
  const date = new Date(Number(r.timestamp) * 1000).toLocaleString("id-ID");
  const price = (Number(r.priceUSDCents) / 100).toFixed(2);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-sky-400 font-bold text-sm">#{Number(r.id)}</span>
          <h3 className="font-semibold text-lg">{r.exporter}</h3>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
          r.verified ? "bg-emerald-900 text-emerald-300" : "bg-amber-900 text-amber-300"
        }`}>
          {r.verified ? "✅ Verified" : "⏳ Unverified"}
        </span>
      </div>
      <div className="text-2xl font-bold text-fuchsia-400 mb-3">${price} / ton</div>
      <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
        <span>⚡ {Number(r.qualityKcal).toLocaleString()} Kcal</span>
        <span>📰 {r.priceSource}</span>
        <span>🕐 {date}</span>
        {r.verified && r.remarks && <span>📝 {r.remarks}</span>}
      </div>
      {r.flagged && (
        <div className="mt-2 text-xs bg-red-900 border border-red-700 text-red-300 px-3 py-2 rounded-lg">
    ⚠️ <strong>Fraud Alert:</strong> {r.flagReason}
         </div>
)}
      {onVerify && !r.verified && (
        <button
          onClick={() => onVerify(Number(r.id))}
          className="mt-4 w-full bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold py-2 rounded-lg transition"
        >
          ✔ Verifikasi Record Ini
        </button>
      )}
    </div>
  );
}