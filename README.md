<div align="center">

# 💎 WA Top-Up Bot

### Bot WhatsApp Otomatis untuk Top-Up Game, Paket Kuota & Token PLN

**Dibangun dengan Baileys · Terintegrasi Digiflazz · Berjalan di Termux**

[![Node.js](https://img.shields.io/badge/Node.js-≥18.0.0-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Baileys](https://img.shields.io/badge/Baileys-6.7.18-FF6B6B?style=flat-square&logo=whatsapp&logoColor=white)](https://github.com/WhiskeySockets/Baileys)
[![Digiflazz](https://img.shields.io/badge/Digiflazz-API-00C7B7?style=flat-square)](https://digiflazz.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Platform: Termux](https://img.shields.io/badge/Platform-Termux-122?style=flat-square&logo=android&logoColor=white)](https://termux.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

[📖 Dokumentasi](#-daftar-isi) · [🚀 Quick Start](#-quick-start) · [🤖 Command](#-daftar-command) · [💡 Contoh](#-contoh-penggunaan) · [❓ FAQ](#-faq)

</div>

---

> ⚠️ **Disclaimer**: Proyek ini ditujukan untuk tujuan **edukasi & bisnis legal**. Pastikan Anda mematuhi [Kebijakan WhatsApp Business](https://www.whatsapp.com/legal/business-policy) dan regulasi yang berlaku. Penyalahgunaan untuk penipuan/span adalah tanggung jawab pengguna.

---

## 📑 Daftar Isi

- [✨ Fitur Utama](#-fitur-utama)
- [📁 Struktur Project](#-struktur-project)
- [🎯 Arsitektur](#-arsitektur)
- [📦 Prasyarat](#-prasyarat)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Konfigurasi Lengkap](#️-konfigurasi-lengkap)
- [🔐 Metode Login WhatsApp](#-metode-login-whatsapp)
- [🤖 Daftar Command](#-daftar-command)
- [💡 Contoh Penggunaan](#-contoh-penggunaan)
- [🗄️ Struktur Database](#️-struktur-database)
- [🔌 Digiflazz API](#-digiflazz-api)
- [🛠️ Menjalankan dengan PM2](#️-menjalankan-dengan-pm2)
- [☁️ Deploy ke VPS / Cloud](#️-deploy-ke-vps--cloud)
- [🔧 Troubleshooting](#-troubleshooting)
- [❓ FAQ](#-faq)
- [🔒 Keamanan](#-keamanan)
- [🤝 Kontribusi](#-kontribusi)
- [📋 Changelog](#-changelog)
- [📄 Lisensi](#-lisensi)

---

## ✨ Fitur Utama

### 🎮 Top-Up Otomatis
- ✅ **Free Fire** — 5 hingga 1450 Diamond + Membership Mingguan/Bulanan
- ✅ **Growtopia** — World Lock (10, 25, 50, 100 WL)
- ✅ **Paket Kuota** — Tri, Telkomsel, XL, Indosat, Axis
- ✅ **Token PLN** — 20K, 50K, 100K, 200K
- ✅ Mudah ditambahkan produk baru (cukup edit `database/products.json`)

### 💰 Sistem Saldo & Deposit
- ✅ Saldo otomatis per user (tersimpan di `users.json`)
- ✅ Sistem deposit fleksibel (QRIS / VA / E-Wallet)
- ✅ Refund otomatis jika transaksi gagal
- ✅ Riwayat transaksi (maks. 50 per user)

### 🔌 Integrasi Provider
- ✅ **Digiflazz** (utama) — Cek saldo, Order, Cek status, Webhook
- ✅ **VIP Reseller** (opsional, siap diaktifkan)
- ✅ Mode **Sandbox** untuk testing tanpa uang asli
- ✅ Signature MD5 sesuai standar Digiflazz

### 🤖 Bot WhatsApp Canggih
- ✅ Login via **QR Code** atau **Pairing Code 8 digit** (rekomendasi Termux)
- ✅ Sesi tersimpan otomatis (tidak perlu scan ulang setiap restart)
- ✅ Auto-reconnect ketika koneksi putus
- ✅ Auto-read message & indikator "mengetik..."
- ✅ Welcome message untuk user baru
- ✅ Self-bot mode (hanya owner)

### 👑 Panel Owner
- ✅ Tambah/kurangi saldo user
- ✅ Broadcast ke semua user
- ✅ Statistik bot (total user, omzet, profit)
- ✅ Update harga produk on-the-fly
- ✅ Cek saldo Digiflazz real-time

### 📱 Ramah Termux
- ✅ Tidak butuh VPS, jalan langsung di Android
- ✅ Ringan, RAM < 100 MB
- ✅ Auto-restart dengan PM2
- ✅ Dukungan background mode

---

## 📁 Struktur Project

```
wa-topup-bot/
├── config.js                   # Konfigurasi bot (Prefix, Owner, API Key, dll)
├── index.js                    # Entry point utama & koneksi WhatsApp (Baileys)
├── package.json                # File dependency Node.js
├── README.md                   # Dokumentasi ini
├── .gitignore                  # File yang diabaikan Git
│
├── database/                   # Penyimpanan data (JSON-based)
│   ├── users.json              # Data saldo & riwayat pengguna
│   ├── products.json           # Katalog produk (FF, GT, Kuota, PLN)
│   └── transactions.json       # Log semua transaksi
│
├── lib/                        # Library inti
│   ├── connection.js           # Manajemen koneksi WhatsApp & QR/Pairing
│   └── pPOB.js                 # Integrasi Provider Top-Up API (Digiflazz)
│
├── handlers/                   # Logika pemrosesan
│   ├── messageHandler.js       # Routing command & business logic
│   └── menu.js                 # Template pesan & menu
│
└── sessions/                   # (Auto-generated) Sesi WhatsApp login
```

---

## 🎯 Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                       USER (WhatsApp)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ Pesan (text)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  WhatsApp (Baileys Socket)                  │
│              via @whiskeysockets/baileys                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ messages.upsert event
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  lib/connection.js                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  QR / Pairing Code Auth                             │   │
│  │  Auto-reconnect on disconnect                       │   │
│  │  Multi-file auth state (sessions/)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ sock, m
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                handlers/messageHandler.js                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐  │
│  │  Parsing   │→ │  Routing   │→ │  Business Logic    │  │
│  │  Prefix    │  │  Command   │  │  (Order/Deposit)   │  │
│  └────────────┘  └────────────┘  └─────────┬──────────┘  │
└──────────────────────────────────────────┬──────────────────┘
                                           │
              ┌────────────────────────────┴─────────────────┐
              │                                                │
              ▼                                                ▼
┌───────────────────────────┐              ┌─────────────────────────────┐
│   handlers/menu.js        │              │     lib/pPOB.js             │
│  Template & formatting    │              │  Digiflazz API Integration  │
│  (Menu, Struk, Banner)    │              │  (cekSaldo, orderTopup,     │
└───────────────────────────┘              │   cekStatus, webhook)       │
                                           └──────────────┬──────────────┘
                                                          │ HTTPS + MD5 sign
                                                          ▼
                                          ┌───────────────────────────────┐
                                          │   Digiflazz API Server        │
                                          │   api.digiflazz.com/v1        │
                                          └───────────────────────────────┘

              ┌──────────────────────────────────────────┐
              │           database/ (JSON)               │
              │  ┌────────────┐ ┌────────┐ ┌──────────┐ │
              │  │ users.json │ │ trx.json│ │ products │ │
              │  └────────────┘ └────────┘ └──────────┘ │
              └──────────────────────────────────────────┘
```

---

## 📦 Prasyarat

| Komponen | Minimum | Rekomendasi | Cek Versi |
|----------|---------|-------------|-----------|
| **Android** | 7.0 (Nougat) | 10+ | — |
| **Termux** | 0.118+ | Latest | `pkg version` |
| **Node.js** | 18.0.0 | 20 LTS | `node -v` |
| **npm** | 8.0+ | 10+ | `npm -v` |
| **RAM** | 512 MB | 2 GB+ | — |
| **Storage** | 200 MB | 1 GB | — |
| **Internet** | Stabil | 4G/WiFi | — |
| **Akun Digiflazz** | Active | Verified | https://digiflazz.com |

---

## 🚀 Quick Start

### 1️⃣ Install Termux & Dependencies

```bash
# Update package Termux
pkg update && pkg upgrade -y

# Install Node.js, Git, dan tools pendukung
pkg install nodejs-lts git vim nano -y

# Verifikasi instalasi
node -v   # Harus >= 18.0.0
npm -v    # Harus >= 8.0
```

<details>
<summary>📱 Alternatif: Install dari F-Droid (rekomendasi)</summary>

Termux di Play Store sudah tidak di-update. Download dari **F-Droid** atau **GitHub releases**:
- F-Droid: https://f-droid.org/packages/com.termux/
- GitHub: https://github.com/termux/termux-app/releases

</details>

### 2️⃣ Download Project

```bash
# Opsi A: Clone dari GitHub
git clone https://github.com/USERNAME/wa-topup-bot.git
cd wa-topup-bot

# Opsi B: Copy dari storage
termux-setup-storage
cp -r /sdcard/Download/wa-topup-bot ~/
cd ~/wa-topup-bot
```

### 3️⃣ Install Dependency

```bash
npm install
```

<details>
<summary>🔧 Jika gagal install Baileys</summary>

```bash
# Install build tools
pkg install python make clang -y

# Reinstall dengan build from source
npm install --build-from-source

# Atau clear cache lalu retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

</details>

### 4️⃣ Konfigurasi Bot

```bash
# Edit config.js menggunakan nano/vim
nano config.js
```

Ganti minimal:
```js
ownerNumber: ['628XXXXXXXXXX'],       // Nomor WhatsApp Anda
pairingNumber: '628XXXXXXXXXX',       // Nomor untuk pairing
digiflazz: {
  username: 'USERNAME_DIGIFLAZZ_ANDA',
  apiKey: 'APIKEY_DIGIFLAZZ_ANDA',
  sandbox: true                        // true untuk testing
}
```

### 5️⃣ Jalankan Bot

```bash
node index.js
```

Anda akan melihat output seperti:

```
╔══════════════════════════════════════════════╗
║                                              ║
║        💎  TOPUP-STORE  💎                   ║
║                                              ║
║        WhatsApp Top-Up Bot v1.0.0            ║
║                                              ║
╠══════════════════════════════════════════════╣
║  📦 Provider : Digiflazz                     ║
║  🔌 Metode   : PAIRING                      ║
║  ⚙️  Prefix   : .                           ║
║  🌐 Timezone : Asia/Jakarta                 ║
║  🧪 Sandbox  : true                         ║
╚══════════════════════════════════════════════╝

[INFO] Menghubungkan ke WhatsApp...

========================================
  KODE PAIRING ANDA
  >>>  ABCD-1234  <<<
========================================

[INFO] Masukkan kode ini di WhatsApp:
[INFO] Pengaturan > Perangkat tertaut > Tautkan perangkat > Masukkan kode

[OK] ✅ Bot WhatsApp berhasil terhubung!
[INFO] Login sebagai: Nama Anda (628xxxxxxxxx)
[OK] Bot siap digunakan. Ketik ".menu" di WhatsApp untuk tes.
```

### 6️⃣ Tes Bot

Kirim pesan ke nomor bot Anda:
```
.menu
```

Bot akan membalas dengan menu utama. Selesai! 🎉

---

## ⚙️ Konfigurasi Lengkap

File `config.js` berisi semua pengaturan bot. Berikut penjelasan setiap bagian:

### Identitas Bot
```js
botName: 'TOPUP-STORE',           // Nama yang tampil di pesan bot
ownerName: 'Admin',                // Nama owner
ownerNumber: ['6281234567890'],    // Bisa banyak nomor (array)
version: '1.0.0',                  // Versi bot
```

### Command
```js
prefix: '.',   // Ubah ke '!', '/', '#', dll sesuai selera
```

### Metode Koneksi
```js
connectMethod: 'pairing',          // 'qr' atau 'pairing'
pairingNumber: '6281234567890',    // Wajib jika connectMethod = 'pairing'
```

### Digiflazz
```js
digiflazz: {
  username: 'YOUR_DGFLAZZ_USERNAME',
  apiKey: 'YOUR_DGFLAZZ_APIKEY',
  devSKU: 'test',                  // SKU testing (lihat dashboard Digiflazz)
  webhookUrl: '',                  // URL webhook untuk callback status
  sandbox: true                    // ⚠️ false untuk transaksi real!
}
```

### Fitur Bot
```js
features: {
  autoReadMessage: true,           // Tandai pesan sebagai dibaca
  autoTyping: true,                // Tampilkan indikator "mengetik..."
  autoRecording: false,            // Tampilkan indikator "merekam..."
  welcomeMessage: true,            // Sambutan untuk user baru
  selfBot: false                   // true = hanya owner yang bisa pakai
}
```

### Markup / Keuntungan
```js
markup: {
  defaultPercent: 5,               // Default 5% dari harga modal
  minProfit: 500,                  // Minimal profit Rp 500
  customProduct: {                 // Override per SKU
    'FF50': 10,                    // FF50 profit 10%
    'TRI10GB1D': 3                 // TRI10GB1D profit 3%
  }
}
```

### Deposit
```js
deposit: {
  minDeposit: 5000,                // Minimal Rp 5.000
  maxDeposit: 10000000,            // Maksimal Rp 10.000.000
  paymentMethod: ['QRIS', 'BCA', 'DANA', 'OVO', 'GOPAY'],
  autoApprove: false               // true = auto approve (butuh payment gateway)
}
```

---

## 🔐 Metode Login WhatsApp

Bot mendukung 2 metode login:

### 1. Pairing Code (REKOMENDASI TERMUX)

Tidak perlu scan QR, cukup masukkan 8 digit kode di WhatsApp.

**Cara pakai:**
1. Set `connectMethod: 'pairing'` di `config.js`
2. Set `pairingNumber` dengan nomor WhatsApp Anda
3. Jalankan `node index.js`
4. Kode 8 digit akan muncul di terminal
5. Di WhatsApp: **Pengaturan → Perangkat tertaut → Tautkan perangkat → Masukkan kode**

**Keunggulan:**
- ✅ Tidak perlu kamera scan QR
- ✅ Cocok untuk layar HP kecil
- ✅ Bisa dari jarak jauh

### 2. QR Code (Default)

Scan QR dengan kamera WhatsApp.

**Cara pakai:**
1. Set `connectMethod: 'qr'` di `config.js`
2. Jalankan `node index.js`
3. QR akan tampil di terminal
4. Di WhatsApp: **Pengaturan → Perangkat tertaut → Tautkan perangkat → Scan QR**

**Keunggulan:**
- ✅ Lebih familiar
- ✅ Tidak perlu set nomor di config

> 💡 **Tips**: Setelah login berhasil, sesi disimpan di `sessions/`. Restart bot **tidak perlu login ulang**.

---

## 🤖 Daftar Command

### 👤 Command User

| Command | Alias | Fungsi | Contoh |
|---------|-------|--------|--------|
| `.menu` | `.start`, `.help` | Menu utama | `.menu` |
| `.1` | `.game` | Menu top-up game (FF, GT) | `.1` |
| `.2` | `.kuota` | Menu paket kuota | `.2` |
| `.3` | `.pln` | Menu token PLN | `.3` |
| `.saldo` | `.balance` | Cek saldo Anda | `.saldo` |
| `.deposit` | — | Tambah saldo | `.deposit 50000` |
| `.order` | `.topup`, `.beli` | Buat pemesanan | `.order FF50 123456789` |
| `.status` | — | Cek status transaksi | `.status TRX-XXX-XXX` |
| `.riwayat` | `.history` | Riwayat 10 transaksi | `.riwayat` |
| `.bantuan` | `.cara` | Panduan order | `.bantuan` |
| `.hubungi` | `.admin` | Kontak admin | `.hubungi` |
| `.back` | `.batal` | Kembali ke menu utama | `.back` |

### 👑 Command Owner (Khusus Admin)

| Command | Fungsi | Contoh |
|---------|--------|--------|
| `.addsaldo` | Tambah saldo user | `.addsaldo 628xxx 50000` |
| `.minsaldo` | Kurangi saldo user | `.minsaldo 628xxx 10000` |
| `.cekdeposit` | Cek saldo Digiflazz | `.cekdeposit` |
| `.broadcast` | Broadcast ke semua user | `.broadcast Promo hemat!` |
| `.stats` | Statistik bot | `.stats` |
| `.setharga` | Update harga produk | `.setharga FF50 11000` |

---

## 💡 Contoh Penggunaan

### 🎮 Top-Up Free Fire

```
User: .order FF50 123456789

Bot: ╔══════════════════════════╗
     ║   TOPUP-STORE            ║
     ╚══════════════════════════╝
     ⏰ 17/10/2026, 15.30
     ──────────────────────

     ⏳ PEMESANAN DIPROSES

     Ref ID : TRX-MNXK2-AB12
     Produk : 50 Diamond Free Fire
     Tujuan : 123456789
     Harga  : Rp 10.000

     Sedang diproses, mohon tunggu 1-5 menit...

     [Setelah sukses:]

     🧾 STRUK TRANSAKSI

     Ref ID : TRX-MNXK2-AB12
     Produk : 50 Diamond Free Fire
     SKU    : FF50
     Tujuan : 123456789
     Harga  : Rp 10.000
     Status : Sukses
     SN     : FF50XXXXXX123456
     ──────────────────────
     Terima kasih telah bertransaksi 🙏
```

### 📶 Top-Up Paket Kuota Tri

```
User: .order TRI10GB1D 089123456789

Bot: ⏳ PEMESANAN DIPROSES
     Ref ID : TRX-MNXK3-CD34
     Produk : Tri 10GB 1 Hari
     Tujuan : 089123456789
     Harga  : Rp 10.000
     ...
     ✅ STRUK TRANSAKSI
     Status : Sukses
```

### ⚡ Beli Token PLN

```
User: .order PLN50K 12345678901

Bot: ✅ Token PLN Anda:
     SN: 1234-5678-9012-3456-7890
     Ref: TRX-MNXK4-EF56
```

### 💰 Deposit Saldo

```
User: .deposit 50000

Bot: ✅ DEPOSIT BERHASIL
     Jumlah    : Rp 50.000
     Metode    : QRIS (Simulasi)
     Saldo Akhir: Rp 75.000
```

### 📊 Cek Statistik (Owner)

```
User: .stats

Bot: 📊 STATISTIK BOT

     👥 Total User: 42
     💰 Total Deposit User: Rp 1.250.000
     🛒 Total Transaksi: 128
     ✅ Transaksi Sukses: 115
     ❌ Transaksi Gagal: 8
     ⏳ Pending: 5
     💎 Total Omzet: Rp 4.250.000
     📈 Total Profit: Rp 425.000
```

### 📢 Broadcast (Owner)

```
User: .broadcast 🔥 Promo akhir bulan! Semua produk diskon 10%!

Bot: ✅ Broadcast terkirim ke 42/42 user.
```

---

## 🗄️ Struktur Database

Bot menggunakan **JSON file** sebagai database (sederhana & tanpa instalasi tambahan).

### `users.json`
```json
{
  "users": {
    "6281234567890": {
      "phone": "6281234567890",
      "jid": "6281234567890@s.whatsapp.net",
      "name": "Budi",
      "balance": 50000,
      "registeredAt": "2026-10-17T10:00:00.000Z",
      "transactions": [
        {
          "refId": "TRX-XXX-XXX",
          "sku": "FF50",
          "productName": "50 Diamond Free Fire",
          "customerId": "123456789",
          "price": 10000,
          "status": "Sukses",
          "sn": "FF50XXXXX",
          "createdAt": "2026-10-17T10:05:00.000Z"
        }
      ],
      "deposits": [
        {
          "amount": 50000,
          "method": "QRIS",
          "status": "PAID",
          "createdAt": "2026-10-17T10:00:00.000Z"
        }
      ],
      "status": "active"
    }
  },
  "meta": {
    "totalUsers": 1,
    "totalDeposit": 50000,
    "totalTransactions": 1,
    "lastUpdated": "2026-10-17T10:05:00.000Z"
  }
}
```

### `products.json`
Lihat file [`database/products.json`](database/products.json) untuk contoh lengkap. Format:
```json
{
  "categories": [
    { "id": "freefire", "name": "Free Fire", "icon": "🎮" }
  ],
  "products": {
    "freefire": [
      {
        "sku": "FF50",
        "name": "50 Diamond Free Fire",
        "price": 10000,
        "modal": 9000,
        "category": "freefire"
      }
    ]
  }
}
```

### `transactions.json`
Array berisi semua transaksi (maks. 1000 entri, FIFO).

---

## 🔌 Digiflazz API

Bot terintegrasi penuh dengan Digiflazz API. Semua fungsi ada di `lib/pPOB.js`:

| Fungsi | Endpoint | Deskripsi |
|--------|----------|-----------|
| `cekSaldo()` | `/cek-saldo` | Cek saldo deposit Digiflazz |
| `getProduk(brand, type)` | `/price-list` | Ambil daftar produk |
| `orderTopup(sku, id, refId)` | `/transaction` | Buat order top-up |
| `cekStatus(refId)` | `/transaction` | Cek status transaksi |
| `requestDeposit(amount, method)` | `/deposit` | Top-up saldo Digiflazz |
| `parseWebhook(body)` | — | Parser callback webhook |

### Cara Dapatkan API Key Digiflazz

1. Daftar di https://digiflazz.com
2. Verifikasi email & nomor HP
3. Login ke dashboard
4. Buka menu **API Key** atau **Pengaturan Developer**
5. Copy `Username` dan `API Key`
6. Paste ke `config.js`

### Setup Webhook (Opsional)

Untuk menerima callback otomatis ketika status transaksi berubah:

1. Set `webhookUrl` di `config.js`:
   ```js
   webhookUrl: 'https://domain-anda.com/webhook/digiflazz'
   ```

2. Aktifkan webhook di dashboard Digiflazz

3. Buat endpoint webhook (butuh server publik)

<details>
<summary>📖 Contoh server webhook (Express.js)</summary>

```js
const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

app.post('/webhook/digiflazz', (req, res) => {
  const { ref_id, status, sn } = req.body.data;
  console.log(`Update ${ref_id}: ${status} SN=${sn}`);
  // TODO: Update database & kirim notifikasi ke user
  res.json({ success: true });
});

app.listen(3000, () => console.log('Webhook server on :3000'));
```

</details>

---

## 🛠️ Menjalankan dengan PM2

PM2 memungkinkan bot auto-restart jika crash & berjalan di background.

### Install PM2

```bash
npm install -g pm2
```

### Jalankan Bot

```bash
# Start
pm2 start index.js --name wa-topup-bot

# Lihat log real-time
pm2 logs wa-topup-bot

# Restart
pm2 restart wa-topup-bot

# Stop
pm2 stop wa-topup-bot

# Hapus dari PM2
pm2 delete wa-topup-bot
```

### Auto-Start saat Termux Dibuka

```bash
# Simpan daftar PM2
pm2 save

# Setup startup (ikuti instruksi yang muncul)
pm2 startup

# Untuk Termux, gunakan:
pm2 startup termux
```

### Konfigurasi Lanjutan

```bash
# Dengan memory limit & auto-restart
pm2 start index.js \
  --name wa-topup-bot \
  --max-memory-restart 500M \
  --exp-backoff-restart-delay 1000 \
  --time

# Monitor
pm2 monit

# Status
pm2 status
```

---

## ☁️ Deploy ke VPS / Cloud

Bot ini bisa juga dijalankan di VPS (DigitalOcean, Vultr, Linode, dll).

### Spesifikasi Minimal VPS
- **RAM**: 512 MB (1 GB rekomendasi)
- **Storage**: 10 GB
- **OS**: Ubuntu 22.04 / Debian 12
- **Node.js**: 20 LTS

### Install di VPS

```bash
# SSH ke VPS
ssh root@IP_VPS

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git

# Clone repo
git clone https://github.com/USERNAME/wa-topup-bot.git
cd wa-topup-bot

# Install dependency
npm install

# Konfigurasi
nano config.js

# Jalankan dengan PM2
npm install -g pm2
pm2 start index.js --name wa-topup-bot
pm2 save
pm2 startup
```

### Setup Reverse Proxy dengan Nginx (Opsional)

Untuk webhook Digiflazz, gunakan Nginx:

```nginx
server {
    listen 80;
    server_name domain-anda.com;

    location /webhook/digiflazz {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔧 Troubleshooting

### ❌ Bot tidak bisa login

```bash
# Hapus sesi lama & coba lagi
rm -rf sessions
node index.js
```

**Penyebab umum:**
- Nomor WhatsApp sudah tertaut ke 4 perangkat (limit maksimal)
- Koneksi internet tidak stabil
- Termux ditutup paksa saat proses pairing

### ❌ Gagal install Baileys

```bash
# Install build tools
pkg install python make clang -y

# Install ulang
rm -rf node_modules package-lock.json
npm install --build-from-source
```

### ❌ Transaksi gagal / status GAGAL

**Cek hal berikut:**

1. **Mode sandbox**: Set `sandbox: false` untuk transaksi real
2. **Saldo Digiflazz**: Pastikan saldo cukup (cek `.cekdeposit`)
3. **SKU valid**: SKU harus sesuai katalog Digiflazz (`buyer_sku_code`)
4. **ID tujuan**: Pastikan format benar (ID Player / nomor HP)
5. **Jam operasional**: Beberapa produk hanya bisa dipesan jam tertentu

### ❌ Bot crash setelah beberapa jam

```bash
# Gunakan PM2 dengan memory limit
pm2 start index.js --name wa-topup-bot --max-memory-restart 500M
```

### ❌ Pesan tidak dibalas

- Cek prefix (`.` by default). Coba kirim `.menu`
- Cek `selfBot` di config — jika `true`, hanya owner yang bisa pakai
- Cek log: `pm2 logs wa-topup-bot`

### ❌ Saldo berkurang tapi transaksi pending

Saldo otomatis di-refund jika status `Gagal`. Jika `Pending`, tunggu 1-24 jam. Cek dengan `.status <refId>`.

### ❌ Termux tertutup, bot mati

```bash
# Acquire wake lock agar Termux tidak dimatikan OS
termux-wake-lock

# Atau gunakan PM2 startup
pm2 startup termux
```

---

## ❓ FAQ

<details>
<summary><strong>Q: Apakah bot ini gratis?</strong></summary>

Ya, kode bot 100% gratis (MIT License). Tapi Anda butuh **saldo Digiflazz** untuk transaksi real.
</details>

<details>
<summary><strong>Q: Berapa modal awal untuk mulai?</strong></summary>

- **Rp 0** untuk testing (mode sandbox)
- **Minimal Rp 50.000** saldo Digiflazz untuk produksi
- **Rekomendasi Rp 500.000+** agar stok produk tersedia
</details>

<details>
<summary><strong>Q: Apakah aman dari banned WhatsApp?</strong></summary>

Bot ini menggunakan Baileys (library open-source). Tidak ada jaminan 100% aman, tapi:
- Gunakan nomor sekunder (bukan nomor utama)
- Jangan kirim spam/broadcast berlebihan
- Beri delay antar pesan (sudah ada di code: 500ms)
- Patuhi [ToS WhatsApp](https://www.whatsapp.com/legal/terms-of-service)
</details>

<details>
<summary><strong>Q: Bisakah ditambah produk lain (Mobile Legends, dll)?</strong></summary>

Ya! Cukup edit `database/products.json`:
```json
"mobilelegends": [
  { "sku": "ML86", "name": "86 Diamond ML", "price": 24000, "modal": 22000, "category": "mobilelegends" }
]
```
Pastikan SKU sesuai dengan katalog Digiflazz.
</details>

<details>
<summary><strong>Q: Bagaimana sistem deposit-nya?</strong></summary>

Saat ini deposit masih **mode simulasi** (otomatis bertambah tanpa pembayaran). Untuk produksi, integrasikan dengan:
- **Tripay** (https://tripay.co.id) — QRIS, VA, e-wallet
- **Xendit** (https://xendit.co)
- **Digiflazz Deposit** (`requestDeposit` di `lib/pPOB.js`)

Lihat dokumentasi masing-masing provider untuk implementasi.
</details>

<details>
<summary><strong>Q: Apakah bisa dipakai banyak admin?</strong></summary>

Ya! Tambahkan nomor admin di `config.ownerNumber`:
```js
ownerNumber: ['628111', '628222', '628333']
```
Semua nomor di array akan memiliki akses command owner.
</details>

<details>
<summary><strong>Q: Bagaimana backup data?</strong></summary>

Backup folder `database/` secara berkala:
```bash
# Backup manual
cp -r database/ /sdcard/Download/backup-$(date +%Y%m%d)/

# Backup otomatis dengan cron
crontab -e
# Tambah: 0 3 * * * cp -r ~/wa-topup-bot/database/ ~/backup-$(date +\%Y\%m\%d)/
```
</details>

<details>
<summary><strong>Q: Bisakah migrasi ke database MySQL/MongoDB?</strong></summary>

Bisa. Modifikasi fungsi `loadDB` & `saveDB` di `handlers/messageHandler.js` untuk menggunakan:
- `mysql2` untuk MySQL
- `mongoose` untuk MongoDB
- `prisma` untuk ORM modern
</details>

<details>
<summary><strong>Q: Berapa maksimal user yang bisa ditangani?</strong></summary>

Dengan JSON file, disarankan **maks. 1.000 user aktif**. Untuk skala lebih besar:
- Migrasi ke database proper (MongoDB/PostgreSQL)
- Gunakan VPS dengan RAM 2GB+
- Aktifkan queue system (Bull/Redis)
</details>

---

## 🔒 Keamanan

### ⚠️ PENTING

1. **Jangan bagikan folder `sessions/`** — berisi kredensial WhatsApp Anda. Siapa pun yang punya file ini bisa mengakses akun WhatsApp bot Anda.

2. **Jangan commit API key ke GitHub publik**. Gunakan environment variable:
   ```bash
   # .env (tambahkan ke .gitignore!)
   DGFLAZZ_USERNAME=xxx
   DGFLAZZ_APIKEY=xxx
   ```
   Lalu load di `config.js`:
   ```js
   require('dotenv').config();
   digiflazz: {
     username: process.env.DGFLAZZ_USERNAME,
     apiKey: process.env.DGFLAZZ_APIKEY
   }
   ```

3. **Selalu pakai mode sandbox** saat testing: `sandbox: true`

4. **Backup `database/`** secara berkala

5. **Update dependency rutin**:
   ```bash
   npm audit
   npm update
   ```

6. **Pakai nomor WhatsApp sekunder** untuk bot, bukan nomor pribadi

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Ikuti langkah berikut:

1. **Fork** repository ini
2. Buat branch fitur:
   ```bash
   git checkout -b feature/nama-fitur
   ```
3. Commit perubahan:
   ```bash
   git commit -m "Add: nama fitur baru"
   ```
4. Push ke branch Anda:
   ```bash
   git push origin feature/nama-fitur
   ```
5. Buat **Pull Request**

### Roadmap

- [ ] Integrasi Tripay untuk deposit real
- [ ] Dukungan MySQL/MongoDB
- [ ] Web dashboard untuk owner
- [ ] Sistem referral
- [ ] Auto-reply dengan AI
- [ ] Multi-provider (Tokopay, VipReseller)
- [ ] Sistem voucher/kupon
- [ ] Notifikasi Telegram untuk owner

---

## 📋 Changelog

### v1.0.0 (2026-10-17)
- ✅ Initial release
- ✅ Integrasi Baileys 6.7.18
- ✅ Login via QR & Pairing Code
- ✅ Integrasi Digiflazz API
- ✅ 4 kategori produk (FF, GT, Kuota, PLN)
- ✅ Sistem saldo & deposit
- ✅ 6 command owner
- ✅ Auto-reconnect
- ✅ PM2 support

### Roadmap v1.1.0
- 🚧 Integrasi Tripay payment gateway
- 🚧 Webhook server built-in
- 🚧 Dukungan produk Mobile Legends & Genshin Impact

---

## 📄 Lisensi

```
MIT License

Copyright (c) 2026 WA Top-Up Bot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

Lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

## 📞 Bantuan & Komunitas

| Platform | Link |
|----------|------|
| 📱 WhatsApp | Sesuai `config.ownerNumber` |
| 📧 Email | support@gmail.com |
| 🐛 Issue Tracker | [GitHub Issues](https://github.com/USERNAME/wa-topup-bot/issues) |
| 💬 Discussion | [GitHub Discussions](https://t.me/@PredikSpaceman) |

---

## ⭐ Terima Kasih

Jika proyek ini bermanfaat, berikan **⭐ Star** di GitHub!

<div align="center">

**Dibuat dengan ❤️ untuk komunitas Indonesia**

[⬆ Kembali ke atas](#-wa-top-up-bot)

</div>
