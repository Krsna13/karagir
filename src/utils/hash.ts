/**
 * Computes the SHA-256 hash of a file or blob in the browser.
 * This is used for exact file duplicate detection to prevent fraud.
 */
export const computeFileHash = async (file: File | Blob): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
