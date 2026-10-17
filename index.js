/**
 * index.js
 * Entry point utama bot WhatsApp Top-Up.
 * Menjalankan koneksi Baileys & mendaftarkan handler pesan.
 *
 * Cara menjalankan di Termux:
 *   $ node index.js
 * atau gunakan PM2 agar auto-restart:
 *   $ pm2 start index.js --name wa-topup-bot
 *   $ pm2 logs wa-topup-bot
 */

const chalk = require('chalk');
const config = require('./config');
const { startConnection, log } = require('./lib/connection');
const { handleMessage } = require('./handlers/messageHandler');

/**
 * Banner startup bot.
 */
function printBanner() {
  console.log(chalk.magenta.bold(`
╔══════════════════════════════════════════════╗
║                                              ║
║        💎  ${config.botName}  💎           ║
║                                              ║
║        WhatsApp Top-Up Bot v${config.version}           ║
║                                              ║
╠══════════════════════════════════════════════╣
║  📦 Provider : Digiflazz                     ║
║  🔌 Metode   : ${config.connectMethod.toUpperCase().padEnd(11)}               ║
║  ⚙️  Prefix   : ${config.prefix.padEnd(11)}               ║
║  🌐 Timezone : ${config.timezone.padEnd(11)}               ║
║  🧪 Sandbox  : ${String(config.digiflazz.sandbox).padEnd(11)}               ║
╚══════════════════════════════════════════════╝
`));
  console.log(chalk.gray(`[${new Date().toISOString()}] Booting bot...\n`));
}

/**
 * Main entry.
 */
async function main() {
  printBanner();

  // Validasi konfigurasi penting
  if (config.digiflazz.username === 'YOUR_DGFLAZZ_USERNAME' || config.digiflazz.apiKey === 'YOUR_DGFLAZZ_APIKEY') {
    log.warn('⚠️  API Digiflazz belum dikonfigurasi!');
    log.warn('   Edit config.js -> digiflazz.username & digiflazz.apiKey');
    log.warn('   Bot tetap berjalan, tapi transaksi ke provider akan gagal.\n');
  }

  if (config.connectMethod === 'pairing' && config.pairingNumber === '6281234567890') {
    log.warn('⚠️  pairingNumber masih default. Ubah di config.js!');
    log.warn('   Atau ubah connectMethod ke "qr" untuk scan QR.\n');
  }

  // Handle CTRL+C / SIGINT untuk shutdown bersih
  process.on('SIGINT', () => {
    log.warn('\nBot dimatikan oleh user. Sampai jumpa! 👋');
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    log.warn('\nBot dimatikan oleh sistem. Sampai jumpa! 👋');
    process.exit(0);
  });

  // Tangani unhandled errors agar bot tidak crash
  process.on('uncaughtException', (err) => {
    log.error('Uncaught Exception: ' + err.message);
    console.error(err);
  });
  process.on('unhandledRejection', (reason) => {
    log.error('Unhandled Rejection: ' + (reason?.message || reason));
  });

  // Mulai koneksi
  try {
    await startConnection(handleMessage);
    log.success('Bot siap digunakan. Ketik "' + config.prefix + 'menu" di WhatsApp untuk tes.');
  } catch (err) {
    log.error('Gagal memulai bot: ' + err.message);
    console.error(err);
    process.exit(1);
  }
}

// Jalankan
main();
