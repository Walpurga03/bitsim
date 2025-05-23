// Eine Demo zur Transaktions-Simulation mit WebCrypto API
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: {name: "SHA-256"},
    },
    true,
    ["sign", "verify"]
  );
}

export async function signData(privateKey: CryptoKey, data: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(data);
  return await window.crypto.subtle.sign(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    privateKey,
    encoded
  );
}

export async function verifySignature(publicKey: CryptoKey, data: string, signature: ArrayBuffer): Promise<boolean> {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(data);
  return await window.crypto.subtle.verify(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    publicKey,
    signature,
    encoded
  );
}

// Füge diese Funktion hinzu:
export async function computeTransactionId(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Demo-Funktion, die die komplette Transaktion simuliert
export async function demoTransaction(): Promise<void> {
  // Erzeuge ein Key-Pair
  const keyPair = await generateKeyPair();
  // Beispiel-Transaktionsdaten
  const transactionData = "Transaktion: Satoshi überweist 0.5 BTC an Hal";
  
  // Signiere die Transaktionsdaten mit dem privaten Schlüssel
  const signature = await signData(keyPair.privateKey, transactionData);
  
  // Verifiziere die Signatur mit dem öffentlichen Schlüssel
  const valid = await verifySignature(keyPair.publicKey, transactionData, signature);
  
  console.log("Transaktionsdaten:", transactionData);
  console.log("Signatur (Base64):", btoa(String.fromCharCode(...new Uint8Array(signature))));
  console.log("Signatur gültig:", valid);
}
