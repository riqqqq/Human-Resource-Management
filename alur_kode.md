# Alur Kode Detail: Proses Login (Code Flow)

Dokumen ini menjelaskan perjalanan satu fitur secara sangat detail, yaitu **Login**. Kita akan menelusuri kode dari saat User mengetik password hingga data dicek di database.

---

## 🏗️ 1. Fase Frontend (Apa yang User Lakukan)

### **A. Halaman Login (`client/src/pages/LoginPage.jsx`)**

Pertama, user berhadapan dengan file ini. Ini adalah tampilan (UI) yang user lihat.

**Kode UI (Form Input):**
Di bagian `return (...)`, terdapat form input untuk username dan password:
```jsx
// File: client/src/pages/LoginPage.jsx (Sekitar baris 61)
<form onSubmit={handleSubmit} className="space-y-5">
    {/* Input Username */}
    <input 
      value={credentials.username}
      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      ... 
    />
    
    {/* Tombol Submit */}
    <button type="submit">Sign In</button>
</form>
```
*Penjelasan:* Saat user mengetik, React mengupdate *state* `credentials`. Saat tombol ditekan, fungsi `handleSubmit` dijalankan.

### **B. Mengirim Data ke Server (`client/src/pages/LoginPage.jsx`)**

Fungsi `handleSubmit` bertugas membungkus data dan mengirimnya "terbang" ke server.

```jsx
// File: client/src/pages/LoginPage.jsx (Sekitar baris 17)
const handleSubmit = async (e) => {
    // ...
    try {
      // INI BAGIAN PENTING: Mengirim request POST ke alamat '/login'
      const response = await api.post('/login', credentials);
      
      if (response.data.success) {
        // Jika sukses, simpan token
        localStorage.setItem('token', response.data.token);
        // Pindah halaman (Redirect)
        navigate('/admin'); 
      }
    } 
    // ...
}
```
*Alur:* Paket data `{ username: "budi", password: "123" }` dikirim via internet menuju Server.

---

## ⚙️ 2. Fase Backend (Apa yang Server Lakukan)

### **A. Menerima Paket (`server/server.js`)**

Server menerima paket di pintu gerbang utama.
```javascript
// File: server/server.js
app.use('/api', routes); // Semua yang berawalan /api masuk ke sini
```

### **B. Mengarahkan ke Jalur yang Benar (`server/routes/index.js` & `authRoutes.js`)**

Paket masuk ke router utama, lalu diarahkan ke router Auth.

1.  **Router Utama (`server/routes/index.js`)**:
    ```javascript
    router.use('/', authRoutes); // Terusuri ke authRoutes
    ```

2.  **Auth Router (`server/routes/authRoutes.js`)**:
    Di sini ditentukan: "Kalau ada request `POST /login`, siapa yang harus menangani?"
    ```javascript
    // File: server/routes/authRoutes.js
    const { login } = require('../middlewares/auth');
    
    // INI DIA: Arahkan ke fungsi 'login'
    router.post('/login', login);
    ```

### **C. Memproses Logika Login (`server/middlewares/auth.js`)**

Inilah "otak" dari proses login. File ini yang berpikir: "Apakah passwordnya benar?"

```javascript
// File: server/middlewares/auth.js
const login = async (req, res) => {
    // 1. Ambil data dari paket yang dikirim Frontend
    const { username, password } = req.body;

    // 2. PANGGIL MODEL: Cari user di database
    const user = await User.findByUsername(username);
    
    // 3. Cek apakah User ketemu?
    if (!user) {
        return res.status(401).json({ message: 'Invalid username' });
    }

    // 4. Cek Password (Bandingkan inputan user dengan data DB)
    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    
    // 5. Jika sukses, buat Token (Kuncinya)
    const token = jwt.sign({ id: user.id, ... }, JWT_SECRET);

    // 6. Kirim respon balik ke Frontend
    return res.json({ success: true, token, ... });
};
```

---

## 🗄️ 3. Fase Database (Tempat Data Disimpan)

### **A. Mencari User (`server/models/userModel.js`)**

Saat `auth.js` memanggil `User.findByUsername`, kode inilah yang bekerja langsung bicara dengan database (MySQL).

```javascript
// File: server/models/userModel.js
const User = {
    async findByUsername(username) {
        // Query SQL Murni dijalankan di sini
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0]; // Kembalikan user pertama yang ditemukan
    },
    // ...
}
```

---

## 🔄 Ringkasan Alur (The Loop)

1.  **User** ketik & klik di **`LoginPage.jsx`**.
2.  **React** kirim data lewat `api.post`.
3.  **Server** terima di `authRoutes.js`.
4.  **Logic** dijalankan di `auth.js` (Login Handler).
5.  **Logic** minta tolong `userModel.js` cek database.
6.  **Database** jawab "Ada/Tidak".
7.  **Server** kirim "Token/Error" balik ke **React**.
8.  **React** terima Token -> User masuk Dashboard.
