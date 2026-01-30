# 🏢 Mini HRM (Human Resource Management) System

Mini HRM adalah aplikasi web modern dan ringan yang dirancang untuk mempermudah manajemen karyawan dan pelacakan kehadiran. Aplikasi ini menyediakan platform berbasis peran (role-based) yang aman di mana administrator dapat mengelola data tenaga kerja dan karyawan dapat mencatat kehadiran mereka dengan mudah.

## 🚀 Fitur

### Untuk Administrator
- **Dashboard**: Ringkasan status sistem dan statistik cepat.
- **Manajemen Karyawan**: Operasi CRUD untuk data karyawan.
- **Pemantauan Kehadiran**: Melihat seluruh riwayat kehadiran dan menyetujui/menolak catatan kehadiran.
- **Manajemen User**: Menyetujui pendaftaran karyawan baru.

### Untuk Karyawan
- **Portal Mandiri**: Melihat detail data pribadi.
- **Kehadiran**: Fungsionalitas "Clock In" dan "Clock Out" yang mudah.
- **Riwayat**: Melihat log kehadiran pribadi.

---

## 🛠️ Tech Stack

| Komponen | Teknologi | Deskripsi |
|-----------|------------|-------------|
| **Frontend** | React.js (Vite) | Library UI modern dan cepat |
| **Styling** | Tailwind CSS | Framework CSS utility-first |
| **Backend** | Node.js + Express | Server REST API yang tangguh |
| **Database** | MySQL | Manajemen database relasional |
| **Auth** | JWT + Bcrypt | Autentikasi aman & hashing |
| **Uploads** | Multer | Menangani upload file (misal: foto) |

---

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal hal-hal berikut di komputer Anda:
- **Node.js** (v16.0.0 atau lebih baru) - [Download](https://nodejs.org/)
- **MySQL Server** (disarankan v8.0) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download](https://git-scm.com/)

---

## ⚙️ Panduan Instalasi & Pengaturan

Ikuti langkah-langkah ini untuk mengatur proyek secara lokal.

### 1. Clone Repository
```bash
git clone [https://github.com/riqqqq/Human-Resource-Management.git](https://github.com/riqqqq/Human-Resource-Management.git)
cd Human-Resource-Management
```

### 2. Backend Setup
Masuk ke direktori server dan instal dependensi.
```bash
cd server
npm install
```

**Configuration (.env):**
1. Salin file contoh environment:
   ```bash
   cp .env.example .env
   ```
   *(Atau ganti nama `.env.example` menjadi `.env`)*
   
2. Buka `.env` dan konfigurasikan pengaturan database Anda:
   ```ini
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=hrm_db
   JWT_SECRET=secure_random_string
   ```

**Database Initialization:**
Jalankan skrip setup untuk membuat database dan tabel yang diperlukan secara otomatis.
```bash
node setup-db.js
```
*Output harus menampilkan: `✅ Database setup complete!`*

### 3. Frontend Setup
Buka terminal baru, masuk ke direktori client, dan instal dependensi.
```bash
cd client
npm install
```

---

## 🏃‍♂️ Menjalankan Aplikasi

Anda perlu menjalankan server backend dan client frontend secara bersamaan.

### Jalankan Server Backend
```bash
# Di dalam direktori 'server'
npm run dev
```
server akan berjalan di `http://localhost:5000`

### Jalankan Client Frontend
```bash
# Di dalam direktori 'client'
npm run dev
```
Client akan berjalan di `http://localhost:5173` (Buka URL ini di browser Anda)

---

## 🔑 Kredensial Login Default

Skrip setup membuat akun administrator default:

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |

---

## 📂 Struktur Proyek

```
Human-Resource-Management/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views (Dashboard, Login, etc.)
│   │   └── services/       # API service functions (Axios)
│   └── ...
├── server/                 # Backend Node.js application
│   ├── config/             # Database connection & setup
│   ├── controllers/        # Request logic handler
│   ├── middlewares/        # Auth & Role verification
│   ├── models/             # Database queries (SQL)
│   ├── routes/             # API Endpoints
│   └── uploads/            # Storage for user uploads
└── README.md
```

---

## 🔧 Pemecahan Masalah (Troubleshooting)

### Error Koneksi Database
- Pastikan server MySQL berjalan.
- Verifikasi `DB_USER` dam `DB_PASSWORD` di `server/.env` sudah benar.
- Jika menggunakan XAMPP, pastikan service Apache dan MySQL sudah dimulai (started).

### Error CORS 
- Jika frontend tidak dapat berkomunikasi dengan backend, periksa apakah backend berjalan pada port yang diharapkan (default: 5000) dan service API frontend mengarah ke URL yang benar.

---
# 🚀 Rencana Pengembangan Fitur (3-Day Sprint Extension)

Dokumen ini merincikan roadmap pengembangan fitur lanjutan yang akan diselesaikan dalam waktu 3 hari. Fokus utama adalah perbaikan UX pada autentikasi, restrukturisasi manajemen user, dan penambahan fitur cuti serta analitik.

---

## 📅 Timeline & Prioritas

### 1. Perbaikan Autentikasi & Keamanan (Day 1 - Pagi)
**Objective:** Meningkatkan User Experience (UX) dan keamanan saat login gagal.

* [ ] **Refactor Login Logic (Post-Redirect-Get Pattern):**
    * Memastikan jika login gagal (username/password salah), sistem merender dengan sangat cepat atau menambahkan fitur username/password salah.
    * Sistem akan melakukan *redirect* kembali ke halaman login dengan sesi bersih.
* [ ] **Flash Message Handling:**
    * Menampilkan pesan error "Username atau Password salah" menggunakan flash session yang akan hilang setelah halaman di-refresh satu kali.
* [ ] **Clear Input Fields:**
    * Memastikan field password otomatis dikosongkan saat redirect balik ke halaman login untuk keamanan.

### 2. Restrukturisasi Manajemen User - Admin (Day 1 - Siang s/d Sore)
**Objective:** Membersihkan dashboard utama dan mengelompokkan manajemen user agar lebih terorganisir.

* [ ] **Cleanup Dashboard Utama:**
    * Menghapus widget/notifikasi "Approval User Baru" dari dashboard utama Admin agar tampilan lebih fokus pada statistik.
* [ ] **Revamp Halaman `Menu Users`:**
    * Membuat tampilan manajemen user dengan sistem **Tab Navigasi** yang membagi user menjadi 3 kategori status:
        1.  **Active:** User yang sudah disetujui dan bisa login.
        2.  **Pending (Perlu Diaktifkan):** User baru mendaftar yang butuh approval admin.
        3.  **Non-Aktif:** User yang diblokir atau resign.
* [ ] **Action Buttons:**
    * Menambahkan tombol aksi cepat (Approve, Reject, Ban, Restore) pada masing-masing tab.

### 3. Dashboard Admin: Analytics & Leaderboard (Day 2)
**Objective:** Memberikan wawasan visual mengenai produktivitas karyawan.

* [ ] **Integrasi Library Chart (e.g., Chart.js / ApexCharts):**
    * Instalasi dan konfigurasi library chart.
* [ ] **Chart Kehadiran (Attendance Chart):**
    * Menampilkan grafik batang/garis untuk tren kehadiran karyawan dalam 7 atau 30 hari terakhir.
* [ ] **Leaderboard Karyawan Teraktif:**
    * Membuat widget tabel "Top Employees" berdasarkan kriteria (misal: kehadiran paling tepat waktu, durasi kerja terlama, atau penyelesaian tugas).

### 4. Fitur Manajemen Cuti - Karyawan (Day 3)
**Objective:** Digitalisasi proses pengajuan cuti karyawan.

* [ ] **Database Schema Update:**
    * Membuat tabel `leaves` (id, user_id, type, start_date, end_date, reason, status, approved_by).
    * Menambahkan kolom `leave_balance` (sisa cuti) pada tabel user.
* [ ] **UI Dashboard Karyawan:**
    * **Info Card Sisa Cuti:** Widget yang menampilkan jumlah sisa jatah cuti tahunan.
    * **Form Pengajuan Cuti:** Form input tanggal dan alasan cuti.
    * **Riwayat Cuti:** Tabel status pengajuan (Pending, Approved, Rejected).
* [ ] **Logika Backend:**
    * Validasi agar pengajuan tidak melebihi sisa cuti.
    * Notifikasi ke Admin/Atasan saat ada pengajuan baru (via dashboard).

---

## 🛠 Tech Stack Notes
* **Charts:** Menggunakan *Chart.js* untuk visualisasi data yang ringan.
* **Tabs UI:** Menggunakan *Tailwind Tabs*.
* **Session Management:** Menggunakan built-in session flash data untuk notifikasi login.