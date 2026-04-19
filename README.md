# Bank Sampah Poltekkes

Selamat datang di **Bank Sampah Poltekkes**! Aplikasi ini dirancang untuk memudahkan pengelolaan tabungan sampah digital. Dengan sistem ini, sampah yang Anda kumpulkan bisa diubah menjadi saldo rupiah yang bermanfaat.

---

## Apa itu Bank Sampah Poltekkes?

Aplikasi ini adalah sistem manajemen tabungan sampah digital yang transparan dan *real-time*. Nasabah (pabung) bisa menyetorkan sampah melalui petugas, melihat riwayat transaksi, dan mencairkan saldo kapan saja.

---

## Peran Pengguna (User Roles)

Ada 3 cara untuk menggunakan aplikasi ini:

1.  **Nasabah (Masyarakat/Mahasiswa)**
    *   Menabung sampah (Organik, Anorganik, dll).
    *   Melihat saldo dan riwayat tabungan secara langsung.
    *   Mengajukan penarikan saldo (Tunai, Pulsa, atau Sembako).
    
2.  **Petugas (Officer)**
    *   Mencatat setoran sampah dari nasabah di lapangan.
    *   Melihat daftar nasabah aktif.
    
3.  **Admin (Administrator)**
    *   Mengatur harga per kilogram untuk setiap jenis sampah.
    *   Mengelola akun pengguna (mengubah peran nasabah menjadi petugas).
    *   Melihat statistik total sampah dan saldo seluruh sistem.

---

## Fitur Utama

*   **Pencatatan Real-Time**: Data tersinkronisasi otomatis (menggunakan Firebase Firestore).
*   **Manajemen Harga**: Harga sampah bisa diubah sewaktu-waktu oleh Admin.
*   **Riwayat Lengkap**: Setiap transaksi setor dan tarik tercatat dengan detail.
*   **Tampilan Modern**: Antarmuka bersih, responsif, dan mudah digunakan di HP maupun Laptop.

---

## Cara Penggunaan (Panduan Cepat)

### 1. Pendaftaran & Login
*   Daftarkan akun sebagai **Nasabah** di halaman Register.
*   Gunakan username dan password untuk masuk ke Dashboard.

### 2. Setor Sampah
*   Bawa sampah Anda ke petugas.
*   Petugas akan memilih nama Anda, jenis sampah, dan beratnya.
*   Saldo akan langsung masuk ke akun Anda saat itu juga!

### 3. Tarik Saldo
*   Buka menu "Tarik Saldo" di Dashboard.
*   Pilih nominal dan metode penarikan (Uang Tunai, Pulsa, atau Sembako).

---

## Cara Menjalankan Project (Untuk Pengembang)

Jika Anda ingin menjalankan aplikasi ini di komputer sendiri:

1.  **Download/Clone** folder project ini.
2.  Buka terminal/command prompt di folder tersebut.
3.  Jalankan perintah untuk install bahan-bahan:
    ```bash
    npm install
    ```
4.  Jalankan perintah untuk memulai aplikasi:
    ```bash
    npm run dev
    ```
5.  Buka link yang muncul (biasanya `http://localhost:5173`).

### Pengaturan Database (Firebase)
Pastikan Anda sudah mengatur **Environment Variables** di Vercel atau file `.env` lokal menggunakan template di `.env.example`.

---

## Akun Demo (Default)
Jika database masih kosong, sistem akan otomatis menyediakan akun berikut:
*   **Admin**: `admin` | Password: `123`
*   **Petugas**: `petugas` | Password: `123`
*   **Nasabah**: `anya` | Password: `123`

