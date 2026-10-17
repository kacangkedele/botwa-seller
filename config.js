/**
 * config.js
 * Konfigurasi global bot WhatsApp Top-Up.
 * Ubah nilai di bawah ini sesuai kebutuhan Anda sebelum menjalankan bot.
 */

module.exports = {
  // ====== IDENTITAS BOT ======
  botName: 'TOPUP-STORE',
  ownerName: 'Admin',
  ownerNumber: ['6281234567890'], // Format: 62 + nomor tanpa 0 di depan. Bisa banyak nomor.
  version: '1.0.0',

  // ====== COMMAND ======
  prefix: '.', // Prefix command (contoh: .menu, .topup, .saldo)

  // ====== KONEKSI WHATSAPP ======
  // Pilih metode koneksi: 'qr' (scan QR) atau 'pairing' (kode pairing 8 digit)
  // Di Termux sangat disarankan menggunakan 'pairing' agar tidak perlu scan QR
  connectMethod: 'pairing',

  // Nomor untuk pairing code (Wajib diisi jika connectMethod = 'pairing')
  // Format: 62xxxxxxxxxxx (tanpa tanda + dan tanpa spasi)
  pairingNumber: '6281234567890',

  // ====== PROVIDER TOP-UP (DIGIFLAZZ) ======
  // Daftar di https://digiflazz.com untuk mendapatkan API Key
  digiflazz: {
    username: 'YOUR_DGFLAZZ_USERNAME',
    apiKey: 'YOUR_DGFLAZZ_APIKEY', // Dapatkan di dashboard Digiflazz
    devSKU: 'test', // SKU untuk testing transaksi
    webhookUrl: '', // Opsional: URL webhook untuk callback status transaksi
    sandbox: true // true = mode testing, false = mode production
  },

  // ====== PROVIDER ALTERNATIF (VIP RESELLER) ======
  // Aktifkan jika ingin menggunakan VIP Reseller sebagai provider
  vipReseller: {
    enabled: false,
    username: 'YOUR_VIP_USERNAME',
    apiKey: 'YOUR_VIP_APIKEY'
  },

  // ====== FITUR BOT ======
  features: {
    autoReadMessage: true, // Otomatis menandai pesan sebagai dibaca
    autoTyping: true, // Tampilkan indikator "mengetik..." saat bot memproses
    autoRecording: false, // Tampilkan indikator "merekam..." (alternatif typing)
    welcomeMessage: true, // Sambutan untuk user baru
    selfBot: false // true = hanya merespons owner (mode private)
  },

  // ====== KONFIGURASI MARKUP / KEUNTUNGAN ======
  markup: {
    defaultPercent: 5, // Default keuntungan 5% dari harga modal
    minProfit: 500, // Minimal keuntungan per transaksi (Rupiah)
    customProduct: {} // Override per produk: { 'SKU': 10 } = 10% untuk SKU tsb
  },

  // ====== SISTEM SALDO DEPOSIT ======
  deposit: {
    minDeposit: 5000, // Minimal deposit Rp 5.000
    maxDeposit: 10000000, // Maksimal deposit Rp 10.000.000
    paymentMethod: ['QRIS', 'BCA', 'DANA', 'OVO', 'GOPAY'], // Metode pembayaran
    autoApprove: false // true = saldo otomatis masuk setelah QRIS dibayar
  },

  // ====== DATABASE PATH ======
  database: {
    users: './database/users.json',
    products: './database/products.json',
    transactions: './database/transactions.json'
  },

  // ====== LOGGING ======
  logLevel: 'silent', // 'debug' | 'info' | 'warn' | 'error' | 'silent'
  timezone: 'Asia/Jakarta'
};
