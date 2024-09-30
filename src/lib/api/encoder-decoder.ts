import { AES_IV, AES_KEY } from "../config";
import CryptoJS from "crypto-js";

const keyBase64 = AES_KEY; // 32 bytes key
const ivBase64 = AES_IV; // 16 bytes IV

const keyBytes = CryptoJS.enc.Base64.parse(keyBase64);
const ivBytes = CryptoJS.enc.Base64.parse(ivBase64);

export function cryptoEncryptData(data) {
  const encrypted = CryptoJS.AES.encrypt(data, keyBytes, {
    iv: ivBytes,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

export function cryptoDecryptData(encryptedData) {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, keyBytes, {
    iv: ivBytes,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypted);
}

export function encodeAPIData(obj) {
  const jsonStr = JSON.stringify(obj);
  const buffer = new TextEncoder().encode(jsonStr);
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64;
}

function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export function decodeApiData(base64) {
  const binaryStr = atob(base64);
  const buffer = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    buffer[i] = binaryStr.charCodeAt(i);
  }
  const jsonStr = new TextDecoder().decode(buffer);

  return isJSON(jsonStr) ? JSON.parse(jsonStr) : jsonStr;
}
