/**
 * handlers/menu.js
 * Berisi template pesan, list menu, dan helper format text bot.
 */

const config = require('../config');
const fs = require('fs');
const path = require('path');

/**
 * Header banner yang ditampilkan di setiap pesan.
 */
function header() {
  const now = new Date().toLocaleString('id-ID', { timeZone: config.timezone });
  return (
    `╔══════════════════════════╗\n` +
    `║   *${config.botName.toUpperCase()}*   ║\n` +
    `╚══════════════════════════╝\n` +
    `⏰ ${now}\n` +
    `👤 Owner: ${config.ownerName}\n` +
    `⚙️ Versi: ${config.version}\n` +
    `──────────────────────`
  );
}

/**
 * Menu utama bot.
 */
function mainMenu(user) {
  const saldo = user?.balance || 0;
  return (
    `${header()}\n\n` +
    `Halo *${user?.name || 'Kak'}* 👋\n` +
    `Saldo Anda: *Rp ${saldo.toLocaleString('id-ID')}*\n\n` +
    `📋 *MENU UTAMA:*\n` +
    `${config.prefix}1 - 🎮 Top-Up Game (FF/GT)\n` +
    `${config.prefix}2 - 📶 Paket Kuota\n` +
    `${config.prefix}3 - ⚡ Token PLN\n` +
    `${config.prefix}saldo - 💰 Cek Saldo\n` +
    `${config.prefix}deposit - 💵 Tambah Saldo\n` +
    `${config.prefix}riwayat - 📜 Riwayat Transaksi\n` +
    `${config.prefix}bantuan - ❓ Cara Order\n` +
    `${config.prefix}hubungi - 📞 Admin\n\n` +
    `💡 _Ketik perintah dengan prefix "${config.prefix}"_`
  );
}

/**
 * Menu top-up game (Free Fire & Growtopia).
 */
function gameMenu(products) {
  let txt = `${header()}\n\n🎮 *TOP-UP GAME*\n\n`;
  txt += `🔥 *FREE FIRE:*\n`;
  products.freefire.forEach((p, i) => {
    txt += `${i + 1}. ${p.name}\n   💰 Rp ${p.price.toLocaleString('id-ID')}\n   SKU: ${p.sku}\n`;
  });
  txt += `\n🌱 *GROWTOPIA:*\n`;
  products.growtopia.forEach((p, i) => {
    txt += `${i + 1}. ${p.name}\n   💰 Rp ${p.price.toLocaleString('id-ID')}\n   SKU: ${p.sku}\n`;
  });
  txt += `\n──────────────────────\n`;
  txt += `📝 *Cara Order:*\n`;
  txt += `${config.prefix}order <SKU> <IDTujuan>\n`;
  txt += `Contoh: ${config.prefix}order FF50 123456789\n\n`;
  txt += `💡 Ketik ${config.prefix}back untuk kembali ke menu utama`;
  return txt;
}

/**
 * Menu paket kuota.
 */
function kuotaMenu(products) {
  let txt = `${header()}\n\n📶 *PAKET KUOTA INTERNET*\n\n`;
  txt += `📡 *TRI:*\n`;
  products.kuota.filter(p => p.sku.startsWith('TRI')).forEach((p, i) => {
    txt += `${i + 1}. ${p.name}\n   💰 Rp ${p.price.toLocaleString('id-ID')}\n   SKU: ${p.sku}\n`;
  });
  txt += `\n📡 *TELKOMSEL:*\n`;
  products.kuota.filter(p => p.sku.startsWith('TSEL')).forEach((p, i) => {
    txt += `${i + 1}. ${p.name}\n   💰 Rp ${p.price.toLocaleString('id-ID')}\n   SKU: ${p.sku}\n`;
  });
  txt += `\n📡 *XL:*\n`;
  products.kuota.filter(p => p.sku.startsWith('XL')).forEach((p, i) => {
    txt += `${i + 1}. ${p.name}\n   💰 Rp ${p.price.toLocaleString('id-ID')}\n   SKU: ${p.sku}\n`;
  });
  txt += `\n📡 *INDOSAT:*\n`;
  products.kuota.filter(p => p.sku.startsWith('ISAT')).forEach((p, i) => {
    txt += `${i + 1}. ${p.name}\n   💰 Rp ${p.price.toLocaleString('id-ID')}\n   SKU: ${p.sku}\n`;
  });
  txt += `\n📡 *AXIS:*\n`;
  products.kuota.filter(p => p.sku.startsWith('AXIS')).forEach((p, i) => {
    txt += `${i + 1}. ${p.name}\n   💰 Rp ${p.price.toLocaleString('id-ID')}\n   SKU: ${p.sku}\n`;
  });
  txt += `\n──────────────────────\n`;
  txt += `📝 *Cara Order:*\n`;
  txt += `${config.prefix}order <SKU> <NomorHP>\n`;
  txt += `Contoh: ${config.prefix}order TRI10GB1D 089123456789\n\n`;
  txt += `💡 Ketik ${config.prefix}back untuk kembali`;
  return txt;
}

/**
 * Menu token PLN.
 */
function plnMenu(products) {
  let txt = `${header()}\n\n⚡ *TOKEN PLN PRABAYAR*\n\n`;
  products.pln.forEach((p, i) => {
    txt += `${i + 1}. ${p.name}\n   💰 Rp ${p.price.toLocaleString('id-ID')}\n   SKU: ${p.sku}\n`;
  });
  txt += `\n──────────────────────\n`;
  txt += `📝 *Cara Order:*\n`;
  txt += `${config.prefix}order <SKU> <NomorMeter>\n`;
  txt += `Contoh: ${config.prefix}order PLN50K 12345678901\n\n`;
  txt += `💡 Ketik ${config.prefix}back untuk kembali`;
  return txt;
}

/**
 * Pesan bantuan cara order.
 */
function helpMenu() {
  return (
    `${header()}\n\n❓ *PANDUAN PEMESANAN*\n\n` +
    `1️⃣ Cek saldo: *${config.prefix}saldo*\n` +
    `2️⃣ Jika saldo kurang, deposit: *${config.prefix}deposit <nominal>*\n` +
    `3️⃣ Pilih produk: *${config.prefix}menu*\n` +
    `4️⃣ Order: *${config.prefix}order <SKU> <tujuan>*\n` +
    `5️⃣ Tunggu proses otomatis (1-5 menit)\n` +
    `6️⃣ Cek status: *${config.prefix}status <refId>*\n\n` +
    `⚠️ *PERHATIAN:*\n` +
    `• Pastikan ID tujuan benar\n` +
    `• Transaksi tidak bisa dibatalkan setelah sukses\n` +
    `• Jika gagal, saldo otomatis dikembalikan\n` +
    `• Hubungi admin jika ada kendala: *${config.prefix}hubungi*\n\n` +
    `📞 Admin: ${config.ownerNumber.join(', ')}`
  );
}

/**
 * Template struk transaksi.
 */
function strukTransaksi(trx) {
  return (
    `${header()}\n\n` +
    `🧾 *STRUK TRANSAKSI*\n\n` +
    `Ref ID : ${trx.refId}\n` +
    `Produk : ${trx.productName}\n` +
    `SKU    : ${trx.sku}\n` +
    `Tujuan : ${trx.customerId}\n` +
    `Harga  : Rp ${trx.price.toLocaleString('id-ID')}\n` +
    `Status : ${trx.status}\n` +
    `Tanggal: ${new Date(trx.createdAt).toLocaleString('id-ID', { timeZone: config.timezone })}\n` +
    (trx.sn ? `SN     : ${trx.sn}\n` : '') +
    `──────────────────────\n` +
    `Terima kasih telah bertransaksi 🙏`
  );
}

/**
 * Pesan ketika command tidak dikenali.
 */
function unknownCommand(cmd) {
  return (
    `${header()}\n\n` +
    `⚠️ Perintah tidak dikenali: *${cmd}*\n\n` +
    `Ketik *${config.prefix}menu* untuk melihat daftar menu.`
  );
}

/**
 * Pesan ketika user belum punya saldo cukup.
 */
function saldoTidakCukup(saldo, harga) {
  return (
    `${header()}\n\n` +
    `❌ *SALDO TIDAK MENCUKUPI*\n\n` +
    `Saldo Anda  : Rp ${saldo.toLocaleString('id-ID')}\n` +
    `Harga       : Rp ${harga.toLocaleString('id-ID')}\n` +
    `Kurang      : Rp ${(harga - saldo).toLocaleString('id-ID')}\n\n` +
    `Silakan deposit dengan *${config.prefix}deposit <nominal>*`
  );
}

/**
 * Pesan sukses deposit.
 */
function depositSukses(amount, method, balance) {
  return (
    `${header()}\n\n` +
    `✅ *DEPOSIT BERHASIL*\n\n` +
    `Jumlah    : Rp ${amount.toLocaleString('id-ID')}\n` +
    `Metode    : ${method}\n` +
    `Saldo Akhir: Rp ${balance.toLocaleString('id-ID')}\n\n` +
    `Sekarang Anda sudah bisa bertransaksi 🎉`
  );
}

/**
 * Pesan owner menu (khusus admin).
 */
function ownerMenu() {
  return (
    `${header()}\n\n` +
    `👑 *MENU OWNER*\n\n` +
    `${config.prefix}addsaldo <nomor> <jumlah> - Tambah saldo user\n` +
    `${config.prefix}minsaldo <nomor> <jumlah> - Kurangi saldo user\n` +
    `${config.prefix}broadcast <pesan> - Kirim broadcast\n` +
    `${config.prefix}cekdeposit - Cek saldo Digiflazz\n` +
    `${config.prefix}resetuser <nomor> - Reset data user\n` +
    `${config.prefix}stats - Statistik bot\n` +
    `${config.prefix}setharga <SKU> <harga> - Update harga produk\n`
  );
}

module.exports = {
  header,
  mainMenu,
  gameMenu,
  kuotaMenu,
  plnMenu,
  helpMenu,
  strukTransaksi,
  unknownCommand,
  saldoTidakCukup,
  depositSukses,
  ownerMenu
};
