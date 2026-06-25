# VERICOAL ⛏
### Sistem Verifikasi Harga Ekspor Komoditas Strategis Berbasis Smart Contract
**Studi Kasus: Batu Bara**

![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636)
![Network](https://img.shields.io/badge/Network-Sepolia%20Testnet-purple)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📌 Tentang Proyek

VERICOAL adalah prototype sistem verifikasi harga ekspor batu bara berbasis blockchain Ethereum yang dibangun sebagai bagian dari riset:

> *"Rancang Bangun Sistem Verifikasi Harga Ekspor Komoditas Strategis Berbasis Smart Contract dengan Studi Kasus Batu Bara"*

Sistem ini bertujuan mengatasi permasalahan transparansi dan manipulasi harga ekspor komoditas batu bara Indonesia melalui teknologi smart contract yang bersifat immutable, transparan, dan terdesentralisasi.

---

## 🎯 Permasalahan yang Diselesaikan

Proses verifikasi harga ekspor batu bara selama ini masih bersifat manual dan terpusat, sehingga rentan terhadap:

- Manipulasi data harga oleh pihak yang tidak bertanggung jawab
- Ketidaktransparanan proses verifikasi
- Sulitnya audit trail historis harga
- Lambatnya proses verifikasi antar instansi

---

## 💡 Solusi

VERICOAL menggunakan smart contract di blockchain Ethereum sebagai **single source of truth** untuk data harga ekspor batu bara, dengan karakteristik:

- **Immutable** — data yang sudah masuk tidak bisa diubah atau dihapus
- **Transparan** — semua pihak bisa memverifikasi data secara real-time
- **Terdesentralisasi** — tidak ada satu pihak yang bisa mengontrol data
- **Audit Trail** — seluruh riwayat transaksi tercatat permanen di blockchain

---

## 👥 Aktor Sistem

| Role | Pihak | Akses |
|---|---|---|
| **Owner** | DGCE / Kementerian ESDM | Deploy kontrak, kelola verifikator & eksportir, verifikasi harga |
| **Verifier** | Tim auditor resmi | Verifikasi harga, tambah catatan verifikasi |
| **Exporter** | PT. Adaro, PT. Bukit Asam, dll | Submit harga batu bara |
| **Public** | Buyer internasional, masyarakat | Lihat dan pantau data (read-only) |

---

## 🔄 Alur Sistem

```
1. EKSPORTIR
   └── Submit harga batu bara ke smart contract
       (nama perusahaan, harga/ton, kualitas Kcal, sumber harga)
       └── Status: Unverified ⏳

2. VERIFIKATOR (DGCE / Kementerian ESDM)
   └── Cocokkan dengan harga referensi HDMA
       ├── Jika sesuai → Verifikasi + tambah catatan
       │   └── Status: Verified ✅
       └── Jika tidak sesuai → Ditahan
           └── Status: Unverified ⏳

3. PUBLIK / BUYER INTERNASIONAL
   └── Pantau semua record secara real-time
       └── Cek status verified/unverified
           └── Transparansi harga terjamin 🌐
```

---

## 🛠 Tech Stack

| Layer | Teknologi |
|---|---|
| Smart Contract | Solidity ^0.8.24 |
| Development Framework | Hardhat v2.22 |
| Blockchain Network | Ethereum Sepolia Testnet |
| Frontend | HTML + CSS + JavaScript |
| Web3 Library | Ethers.js v6.7 |
| Wallet | MetaMask |

---

## 📁 Struktur Project

```
vericoal/
├── contracts/
│   └── CoalPriceRegistry.sol    # Smart contract utama (multi-role)
├── scripts/
│   └── deploy.js                # Script deployment ke Sepolia
├── test/
│   └── Lock.js                  # Unit test
├── index.html                   # Frontend DApp (Web3)
├── hardhat.config.js            # Konfigurasi Hardhat + network
├── .env.example                 # Template environment variables
├── .gitignore
└── README.md
```

---

## 🚀 Cara Menjalankan

### Prerequisites

- Node.js v18+
- MetaMask browser extension
- Sepolia testnet ETH — gratis dari [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

### Instalasi

```bash
# Clone repository
git clone https://github.com/username/vericoal.git
cd vericoal

# Install dependencies
npm install --legacy-peer-deps

# Buat file .env dari template
cp .env.example .env
# Edit .env dan isi PRIVATE_KEY dengan private key wallet kamu
```

### Compile Smart Contract

```bash
npx hardhat compile
```

### Deploy ke Sepolia Testnet

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Catat contract address yang muncul, lalu update `CONTRACT_ADDRESS` di `index.html`.

### Jalankan Frontend

Buka `index.html` menggunakan Live Server di VS Code (klik **Go Live** di pojok kanan bawah), lalu buka di **Chrome** yang sudah terpasang MetaMask.

---

## 📜 Smart Contract

**Contract Address (Sepolia Testnet):**
```
0x1B9e1393935641b4cdD38FCf57bd471Df87003a3
```

**Verifikasi di Etherscan:**
https://sepolia.etherscan.io/address/0x1B9e1393935641b4cdD38FCf57bd471Df87003a3

### Fungsi Utama

| Fungsi | Role | Deskripsi |
|---|---|---|
| `submitPrice()` | Exporter | Submit data harga batu bara ke blockchain |
| `verifyPrice()` | Verifier / Owner | Verifikasi harga dengan catatan resmi |
| `getRecord()` | Public | Ambil data record berdasarkan ID |
| `addVerifier()` | Owner | Tambah alamat wallet verifikator baru |
| `addExporter()` | Owner | Tambah alamat wallet eksportir terdaftar |
| `removeVerifier()` | Owner | Cabut akses verifikator |
| `removeExporter()` | Owner | Cabut akses eksportir |
| `recordCount()` | Public | Cek total record yang tersimpan |
| `isVerifier()` | Public | Cek apakah alamat terdaftar sebagai verifikator |
| `isExporter()` | Public | Cek apakah alamat terdaftar sebagai eksportir |

### Struktur Data (PriceRecord)

```solidity
struct PriceRecord {
    uint256 id;           // ID unik record
    string exporter;      // Nama perusahaan eksportir
    uint256 priceUSDCents;// Harga dalam sen USD (9550 = $95.50/ton)
    uint256 qualityKcal;  // Kualitas batu bara dalam Kilokalori
    string priceSource;   // Sumber harga: HDMA / Argus / Platts
    address submittedBy;  // Wallet address eksportir
    uint256 timestamp;    // Waktu submit (Unix timestamp)
    bool verified;        // Status verifikasi
    address verifiedBy;   // Wallet address verifikator
    string remarks;       // Catatan dari verifikator
}
```

---

## 🔐 Environment Variables

Buat file `.env` berdasarkan `.env.example`:

```
PRIVATE_KEY=your_wallet_private_key_here
SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
```

---

## 📊 Contoh Data Simulasi

| # | Eksportir | Harga/Ton | Kualitas | Sumber | Status |
|---|---|---|---|---|---|
| 1 | PT. Nusantara Coal Resources | $87.50 | 4800 Kcal | HDMA | ✅ Verified |
| 2 | PT. Kalimantan Prima Energy | $102.50 | 5500 Kcal | Argus | ✅ Verified |
| 3 | PT. Borneo Energi Mandiri | $91.00 | 5000 Kcal | Platts | ✅ Verified |
| 4 | PT. Sumatera Coal Internasional | $76.00 | 4200 Kcal | HDMA | ⏳ Unverified |
| 5 | PT. Indo Pacific Mining | $115.00 | 6000 Kcal | Argus | ⏳ Unverified |

### Referensi Harga Berdasarkan Kualitas

| Kualitas (Kcal) | Jenis | Kisaran Harga |
|---|---|---|
| 4200 - 4500 | Low Calorie | $70 - $85/ton |
| 4800 - 5000 | Medium Calorie | $85 - $100/ton |
| 5500 - 5800 | High Calorie | $100 - $115/ton |
| 6000+ | Premium | $115 - $130/ton |

---

## 🗺 Roadmap Pengembangan

- [x] Smart contract dasar — submit dan verifikasi harga
- [x] Sistem multi-role (owner, verifier, exporter, public)
- [x] Frontend Web3 dengan MetaMask integration
- [x] Deploy ke Sepolia Testnet
- [ ] Role-based dashboard (tampilan berbeda per role)
- [ ] Integrasi oracle Chainlink untuk harga referensi HDMA otomatis
- [ ] Notifikasi real-time ketika harga diverifikasi atau ditolak
- [ ] Fitur fraud detection — flagging harga anomali otomatis
- [ ] Mobile responsive frontend
- [ ] Deploy ke Ethereum Mainnet

---

## 💡 Konsep Kunci

### Mengapa Blockchain?

| Masalah Sistem Lama | Solusi Blockchain |
|---|---|
| Data bisa dimanipulasi | Immutable — tidak bisa diubah setelah masuk |
| Proses tidak transparan | Semua transaksi publik dan bisa dicek siapapun |
| Audit trail tidak lengkap | Setiap perubahan status tercatat permanen |
| Terpusat, rentan serangan | Terdesentralisasi, tidak ada single point of failure |

### Apa itu Kcal dalam konteks ini?

Kcal (Kilokalori) adalah satuan nilai kalor batu bara — seberapa banyak energi yang dihasilkan saat dibakar. Semakin tinggi Kcal, semakin berkualitas dan semakin mahal harganya. Parameter ini digunakan verifikator untuk mendeteksi anomali harga (misal: harga premium tapi kualitas rendah).

### Apa itu Gas Fee?

Setiap transaksi di blockchain Ethereum membutuhkan gas fee — biaya kecil yang dibayarkan ke validator jaringan. Di Sepolia Testnet, gas fee menggunakan SepoliaETH yang gratis. Di Mainnet, menggunakan ETH sungguhan.

---

## 👨‍💻 Developer

Dikembangkan sebagai bagian dari riset di:

**Politeknik Negeri Madiun**
Program Studi Teknologi Informasi

---

## 📄 Lisensi

MIT License — bebas digunakan untuk keperluan riset dan edukasi.