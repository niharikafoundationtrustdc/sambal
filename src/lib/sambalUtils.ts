/**
 * Generates a Unique Identification Number (UIN) as per SAMBAL mandate.
 * Format: MM-LKO-2023-XXXX
 */
export function generateUIN(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MM-LKO-${year}-${random}`;
}

/**
 * Encrypts Aadhaar number (placeholder for real encryption).
 * In a real app, this would use a secure vault or server-side encryption.
 */
export function encryptAadhaar(aadhaar: string): string {
  if (!aadhaar) return '';
  return 'ENC-' + btoa(aadhaar).substring(0, 12);
}

/**
 * Validates Pincode (exactly 6 digits).
 */
export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}
