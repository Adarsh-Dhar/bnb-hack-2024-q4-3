# Eddsa Key Management tool for an AMACI voting system

A secure and user-friendly tool for generating, managing, and signing with EdDSA keypairs. Built for cryptographic applications, such as signing MACI messages, the tool ensures robust key lifecycle management with IndexedDB for persistent storage.

Features
- 🔑 Key Lifecycle Management

  Create, import, export, and delete keypairs.
Monitor key statuses: Active, Revoked, Expired, Compromised, Archived.
- 🖋️ Sign and Verify

    Sign MACI-compatible messages.
Verify message authenticity with public keys.
- 📂 Import/Export Keys

    Seamlessly import and export keypairs in JSON format for portability.
- 🔒 Persistent Storage

    Keys stored securely using IndexedDB with encryption.
