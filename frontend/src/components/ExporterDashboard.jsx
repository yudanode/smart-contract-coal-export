import { useState } from "react";
import PublicDashboard from "./PublicDashboard";

export default function ExporterDashboard({ contract, account }) {
  const [form, setForm] = useState({
    exporter: "", price: "", quality: "", source: ""
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submitPrice() {
    if (!form.exporter || !form.price || !form.quality || !form.source)
      return setStatus({ type: "error", msg: "Semua field harus diisi!" });
    setLoading(true);
    setStatus({ type: "info", msg: "⏳ Mengirim transaksi ke blockchain..." });
    try {
      const tx = await contract.submitPrice(
        form.exporter, form.price, form.quality, form.source
      );
      await tx.wait();
      setStatus({ type: "success", msg: `✅ Harga berhasil disubmit! TX: ${tx.hash.slice(0,16)}...` });
      setForm({ exporter: "", price: "", quality: "", source: "" });
    } catch (e) {
      setStatus({ type: "error", msg: "❌ Error: " + e.message });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">📋 Submit Harga Batu Bara</h2>
        {status && (
          <div className={`text-sm p-3 rounded-lg mb-4 ${
            status.type === "success" ? "bg-emerald-900 text-emerald-300" :
            status.type === "error" ? "bg-red-900 text-red-300" :
            "bg-blue-900 text-blue-300"
          }`}>{status.msg}</div>
        )}
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "exporter", label: "Nama Eksportir", placeholder: "PT. Adaro Energy" },
            { key: "source", label: "Sumber Harga", placeholder: "HDMA / Argus / Platts" },
            { key: "price", label: "Harga (sen USD)", placeholder: "9550 = $95.50/ton", type: "number" },
            { key: "quality", label: "Kualitas (Kcal)", placeholder: "5000", type: "number" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
              <input
                type={f.type || "text"}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          ))}
        </div>
        <button
          onClick={submitPrice}
          disabled={loading}
          className="mt-4 w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition"
        >
          {loading ? "Memproses..." : "📤 Submit ke Blockchain"}
        </button>
      </div>
      <PublicDashboard contract={contract} />
    </div>
  );
}