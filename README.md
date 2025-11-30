# 📚 Komik Manager Web App

Aplikasi web minimalis dan futuristik untuk menyimpan dan mengelola daftar komik yang sedang dibaca.  
Dibuat dengan React + Firebase Firestore, serta mendukung tema **Dark Mode** dan **Light Mode**.

Aplikasi ini merupakan versi upgrade dari aplikasi **Python CLI Komik Manager** yang sebelumnya hanya berjalan di desktop/Termux.

---

## ✨ Fitur Utama

- 🔍 **Search komik** berdasarkan judul
- 📑 **Library komik** dalam bentuk tabel futuristik
- ➕ **Tambah komik baru**
- ✏️ **Edit komik**
- ❌ **Hapus komik**
- 🌙 **Dark Mode & Light Mode profesional**
- 📈 **Dashboard futuristik** menampilkan:
  - Total komik
  - Komik terakhir diperbarui
  - Riwayat komik terbaru
- ✨ Animasi smooth (Framer Motion)
- 🔥 Data disimpan di **Firebase Firestore**
- 🌐 Siap deploy ke **Firebase Hosting**

---

## 🧩 Kekurangan & Batasan Versi Saat Ini

Karena ini versi awal:

- ❗ **Belum ada sistem login / autentikasi**
  - Data komik masih bersifat _single-user_
  - Tidak bisa digunakan oleh banyak orang dengan database berbeda
- ❗ Tidak ada sinkronisasi multi-device tanpa login
- ❗ Tidak ada fitur export kembali ke JSON (sementara hanya import)

Roadmap ke depan:

- 🔐 Firebase Auth (Google Login)
- 👥 Multi-user support
- 💾 Auto backup per user
- 📱 Mode offline support (Firestore persistent)

---

## 🛠 Tech Stack

- ⚛ **React + Vite**
- 🔥 **Firebase Firestore**
- 🎨 **TailwindCSS**
- 🌀 **Framer Motion**
- 🌐 **Firebase Hosting**

---

## 📂 Struktur Project (Ringkas)

src/
├── components/
│ ├── Navbar.jsx
│ ├── ComicTable.jsx
│ ├── Toast.jsx
│
├── hooks/
│ ├── useComics.jsx
│
├── pages/
│ ├── Home.jsx
│ ├── List.jsx
│ ├── AddEdit.jsx
│ ├── Search.jsx
│
├── firebase.js
├── firebaseService.js
├── App.jsx
└── main.jsx

---

## 🚀 Cara Menjalankan di Local

npm install
npm run dev

---

## 🔥 Cara Build dan Deploy ke Firebase Hosting

### Build:

npm run build

### Deploy:

firebase deploy

Sebelum deploy, pastikan:

- Sudah menjalankan `firebase login`
- Sudah menjalankan `firebase init` dan memilih:
  - Firestore
  - Hosting
- Folder public → **dist**

---

## 📦 Cara Import Data JSON

Aplikasi mendukung import JSON lokal dengan format:

```json
[
  {
    "title": "Judul Komik",
    "episode": 50,
    "link": "https://alamat-komik.com/chapter-50"
  }
]

📬 Kontribusi

Pull Request dipersilakan.
Untuk perbaikan bug atau penambahan fitur, silakan buat issue.
```
