/**
 * lib/pPOB.js
 * Integrasi Provider Top-Up API (Digiflazz + VIP Reseller).
 * Dokumentasi:
 *   - Digiflazz: https://developer.digiflazz.com/api/v1
 *   - VIP Reseller: https://docs.vip-reseller.co.id/
 *
 * Semua request memakai axios + signature MD5 (crypto-js).
 */

const axios = require('axios');
const CryptoJS = require('crypto-js');
const config = require('../config');

const BASE_URL = 'https://api.digiflazz.com/v1';

/**
 * Generate signature untuk Digiflazz.
 * Format: MD5(username + apiKey + 'dev' untuk testing atau timestamp untuk transaksi)
 */
function generateSign(cmd, timestamp = null) {
  const { username, apiKey } = config.digiflazz;
  const ts = timestamp || '';
  const raw = username + apiKey + cmd + ts;
  return CryptoJS.MD5(raw).toString();
}

/**
 * Cek saldo Digiflazz.
 * @returns {Promise<{deposit: number, status: string}>}
 */
async function cekSaldo() {
  try {
    const { username, apiKey } = config.digiflazz;
    const sign = CryptoJS.MD5(username + apiKey + 'depos').toString();
    const payload = {
      cmd: 'deposit',
      username,
      sign,
      ref_id: null
    };

    const { data } = await axios.post(`${BASE_URL}/cek-saldo`, payload, {
      timeout: 15000
    });

    return {
      success: true,
      deposit: data?.data?.deposit || 0,
      status: data?.data?.status || 'unknown',
      raw: data
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data || err.message
    };
  }
}

/**
 * Ambil daftar produk dari Digiflazz.
 * Filter opsional berdasarkan brand/kategori.
 * @param {string} [brand] - Filter brand (contoh: 'FREE FIRE', 'TELKOMSEL')
 * @param {string} [type] - Filter type (contoh: 'game', 'pulsa', 'data')
 * @returns {Promise<Array>}
 */
async function getProduk(brand = null, type = null) {
  try {
    const { username, apiKey } = config.digiflazz;
    const sign = CryptoJS.MD5(username + apiKey + 'pricelist').toString();
    const payload = {
      cmd: 'pricelist',
      username,
      sign
    };

    if (brand) payload.brand = brand;
    if (type) payload.type = type;

    const { data } = await axios.post(`${BASE_URL}/price-list`, payload, {
      timeout: 30000
    });

    if (data?.data) {
      return {
        success: true,
        products: data.data,
        count: data.data.length
      };
    }
    return { success: false, error: 'Format respons tidak valid', raw: data };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data || err.message
    };
  }
}

/**
 * Buat transaksi top-up (order) ke Digiflazz.
 * @param {string} sku          - Buyer SKU / code produk (contoh: 'FF50')
 * @param {string} customerId   - ID tujuan (ID player / nomor HP)
 * @param {string} refId        - Reference ID unik untuk tracking
 * @returns {Promise<object>}
 */
async function orderTopup(sku, customerId, refId) {
  try {
    const { username, apiKey, devSKU } = config.digiflazz;
    const cmd = config.digiflazz.sandbox ? 'order-dummy' : 'order';
    const sign = CryptoJS.MD5(username + apiKey + refId).toString();

    const payload = {
      username,
      buyer_sku_code: config.digiflazz.sandbox ? devSKU : sku,
      customer_no: customerId,
      ref_id: refId,
      sign,
      testing: config.digiflazz.sandbox
    };

    const endpoint = config.digiflazz.sandbox ? '/transaction' : '/transaction';
    const { data } = await axios.post(`${BASE_URL}${endpoint}`, payload, {
      timeout: 30000
    });

    return {
      success: true,
      refId,
      data: data?.data,
      raw: data
    };
  } catch (err) {
    return {
      success: false,
      refId,
      error: err.response?.data || err.message
    };
  }
}

/**
 * Cek status transaksi berdasarkan ref_id.
 * @param {string} refId
 * @returns {Promise<object>}
 */
async function cekStatus(refId) {
  try {
    const { username, apiKey } = config.digiflazz;
    const sign = CryptoJS.MD5(username + apiKey + refId).toString();
    const payload = {
      cmd: 'status',
      username,
      ref_id: refId,
      sign
    };

    const { data } = await axios.post(`${BASE_URL}/transaction`, payload, {
      timeout: 15000
    });

    return {
      success: true,
      status: data?.data?.status, // Sukses / Pending / Gagal
      sn: data?.data?.sn,
      price: data?.data?.price,
      raw: data?.data
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data || err.message
    };
  }
}

/**
 * Webhook parser untuk callback status dari Digiflazz.
 * Digiflazz akan POST ke webhookUrl ketika status transaksi berubah.
 * @param {object} body - Body request dari Digiflazz
 * @returns {object} hasil parse
 */
function parseWebhook(body) {
  try {
    const { ref_id, status, sn, price, buyer_sku_code, customer_no } = body?.data || body || {};
    return {
      success: true,
      refId: ref_id,
      status, // Sukses / Gagal / Pending
      sn,
      price,
      sku: buyer_sku_code,
      customerId: customer_no,
      raw: body
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Request deposit ke Digiflazz (top-up saldo provider).
 * @param {number} amount - Nominal deposit
 * @param {string} method - 'QRIS' | 'BCA' | 'MANDIRI' | 'BRI'
 * @param {string} bank - Untuk metode transfer bank
 * @param {string} name - Nama pemilik rekening
 */
async function requestDeposit(amount, method = 'QRIS', bank = null, name = null) {
  try {
    const { username, apiKey } = config.digiflazz;
    const sign = CryptoJS.MD5(username + apiKey + 'deposit').toString();
    const payload = {
      username,
      amount: Number(amount),
      bank,
      owner_name: name,
      sign
    };

    const { data } = await axios.post(`${BASE_URL}/deposit`, payload, {
      timeout: 20000
    });

    return {
      success: true,
      data: data?.data,
      raw: data
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data || err.message
    };
  }
}

/**
 * Helper format rupiah.
 */
function formatRupiah(num) {
  if (typeof num !== 'number') num = Number(num) || 0;
  return 'Rp ' + num.toLocaleString('id-ID');
}

/**
 * Generate reference ID unik.
 */
function generateRefId(prefix = 'TRX') {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rnd}`;
}

module.exports = {
  cekSaldo,
  getProduk,
  orderTopup,
  cekStatus,
  parseWebhook,
  requestDeposit,
  generateSign,
  formatRupiah,
  generateRefId
};
