# Dokumen Kebutuhan Bisnis (Business Requirement Document) - JAsku

## 1. Ringkasan Proyek

- **Nama Proyek:** JAsku (Jasaku)
- **Visi:** Menjadi platform digital terpercaya yang menjembatani para penyedia jasa (Partner) dengan calon pengguna jasa (Customer) secara efisien, mudah, dan aman di Indonesia.
- **Misi:**
  - Menyediakan sebuah _marketplace_ yang memungkinkan individu atau usaha kecil untuk memamerkan dan menawarkan keahlian serta jasa mereka kepada audiens yang lebih luas.
  - Mempermudah Customer dalam menemukan, membandingkan, dan menghubungi penyedia jasa yang berkualitas dan sesuai dengan kebutuhan mereka.
  - Membangun ekosistem yang didasari oleh kepercayaan melalui sistem ulasan dan verifikasi.

## 2. Peran Pengguna (User Roles)

Aplikasi ini akan memiliki tiga peran utama dengan hak akses dan fungsi yang berbeda:

| Peran        | Deskripsi                                                                                                         |
| :----------- | :---------------------------------------------------------------------------------------------------------------- |
| **ADMIN**    | Pengelola platform. Bertanggung jawab atas kesehatan ekosistem, manajemen pengguna, konten, dan operasional.      |
| **CUSTOMER** | Pengguna utama aplikasi yang mencari dan menggunakan jasa. Semua pengguna baru secara default memiliki peran ini. |
| **PARTNER**  | Seorang `CUSTOMER` yang telah mendaftar untuk dapat menawarkan dan mengelola jasa mereka di platform JAsku.       |

## 3. Rincian Fitur Berdasarkan Peran

### A. Fitur Umum & Fungsionalitas Lintas Peran

Fitur-fitur ini dapat diakses oleh lebih dari satu peran untuk memastikan pengalaman pengguna yang konsisten.

#### 1. Sistem Autentikasi Pengguna

- **Pendaftaran (Register):** Pengguna dapat mendaftar menggunakan email & kata sandi (default sebagai `CUSTOMER`).
- **Masuk (Login):** Pengguna dapat masuk ke akun mereka.
- **Keluar (Logout):** Mengakhiri sesi pengguna aktif.
- **Lupa Kata Sandi:** Fitur untuk mereset kata sandi melalui email.
- **Login via Google/Social Media:** Opsi untuk mempermudah proses masuk dan registrasi.

#### 2. Fitur Pencarian (Search)

- Berada di _navbar_ utama untuk akses cepat.
- Mencari jasa berdasarkan **kata kunci**.
- **Pencarian Lanjutan & Filter:**
  - Filter berdasarkan **kategori jasa**.
  - Filter berdasarkan **lokasi/kota**.
  - Urutkan hasil berdasarkan **relevansi, rating tertinggi, terbaru, harga**.

#### 3. Sistem Notifikasi

- Akses melalui ikon lonceng di _sidebar/navbar_.
- Memberikan pemberitahuan _real-time_ kepada pengguna (misalnya: pesanan baru, pesan masuk, jasa disetujui).

#### 4. Halaman Detail Jasa

- Menampilkan informasi komprehensif saat sebuah jasa di-klik, meliputi:
  - Judul dan Gambar Sampul (Cover).
  - Galeri foto/portfolio.
  - Deskripsi lengkap jasa.
  - Informasi harga (tetap, per jam, atau "mulai dari").
  - Profil singkat `PARTNER` (foto, nama, link ke profil).
  - **Ulasan dan Rating** dari Customer lain.
  - Tombol untuk **menghubungi** atau **memesan jasa**.

#### 5. Sistem Ulasan dan Peringkat (Rating)

- Setelah jasa selesai, `CUSTOMER` dapat memberikan rating (1-5 bintang) dan ulasan.
- Rating rata-rata akan ditampilkan secara publik untuk membangun kepercayaan.

---

### B. Fitur untuk Peran: CUSTOMER

#### 1. Antarmuka Pengguna (UI)

- **Navbar:**
  - Fitur **Pencarian**.
  - Menu **Akun** (Pengaturan & Logout).
- **Sidebar:**
  - Menu **Beranda**.
  - Menu **Notifikasi**.

#### 2. Beranda (Home)

- Menampilkan semua jasa aktif dalam format _grid_ visual yang menarik.
- Setiap kartu jasa menampilkan info ringkas: Gambar, Judul, Nama Partner, Rating, dan Harga.
- Bagian tambahan seperti "Jasa Populer" atau "Rekomendasi".

#### 3. Manajemen Akun

- Halaman pengaturan untuk memperbarui profil (nama, foto) dan mengubah kata sandi.

#### 4. Riwayat Pesanan

- Halaman untuk melacak daftar jasa yang pernah atau sedang dipesan, beserta statusnya (Menunggu, Dikerjakan, Selesai).

#### 5. Proses Menjadi Partner

- Terdapat tombol atau menu **"Jadilah Partner"** di dalam pengaturan akun untuk memulai proses registrasi `PARTNER`.

---

### C. Fitur untuk Peran: PARTNER

Mewarisi semua fitur `CUSTOMER` dengan tambahan sebagai berikut:

#### 1. Antarmuka Pengguna (UI)

- **Navbar:**
  - Sama seperti `CUSTOMER` dengan tambahan tombol **`+` (Tambah Jasa Baru)**.
- **Sidebar:**
  - Menu **Beranda**.
  - Menu **Notifikasi**.
  - Menu **Anda** (Dasbor Partner).

#### 2. Menu "Anda" (Dasbor Partner)

- Pusat kendali bagi `PARTNER` yang berisi:
  - **Profil Publik Partner**.
  - **Daftar Jasa Anda:** Menampilkan semua jasa yang telah di-upload.
  - **Statistik Sederhana:** Jumlah penayangan, pesanan, dan rating rata-rata.

#### 3. Manajemen Jasa (CRUD)

- **Create:** Menambah jasa baru melalui formulir detail (judul, deskripsi, kategori, harga, foto).
- **Read:** Melihat daftar jasa miliknya di menu "Anda".
- **Update:** Mengedit informasi jasa yang sudah ada.
- **Delete:** Menghapus jasa secara permanen.
- **Toggle Status:** Mengaktifkan atau menonaktifkan jasa sementara tanpa menghapusnya.

#### 4. Manajemen Pesanan Masuk

- Tab khusus untuk melihat pesanan yang masuk dari `CUSTOMER`.
- Fitur untuk **Menerima** atau **Menolak** pesanan.

#### 5. Sistem Komunikasi/Chat Internal

- Fitur chat di dalam platform untuk diskusi antara `PARTNER` dan `CUSTOMER` terkait detail pekerjaan.

---

### D. Fitur untuk Peran: ADMIN

Mengakses platform melalui dasbor administrasi terpisah.

#### 1. Dasbor Utama

- Menampilkan ringkasan statistik vital platform (jumlah pengguna, jasa, transaksi, dll.).

#### 2. Manajemen Pengguna

- Melihat, mencari, dan memfilter semua `CUSTOMER` & `PARTNER`.
- Mengubah peran pengguna secara manual.
- **Menonaktifkan (Suspend)** atau menghapus akun yang melanggar aturan.

#### 3. Manajemen Jasa

- Melihat semua jasa yang ada di platform.
- **Sistem Persetujuan Jasa:**
  - Setiap jasa baru atau yang diperbarui akan masuk ke antrean "Menunggu Persetujuan".
  - `ADMIN` harus me-review dan **menyetujui** (agar tampil publik) atau **menolak** (dengan alasan) jasa tersebut.
- Menghapus atau menyunting paksa jasa yang tidak sesuai.

#### 4. Manajemen Kategori Jasa

- Kemampuan untuk menambah, mengubah, atau menghapus kategori jasa yang tersedia di platform.

#### 5. Verifikasi Partner

- Mengelola proses verifikasi `PARTNER` (misal: validasi KTP) untuk memberikan lencana "Terverifikasi" dan meningkatkan kepercayaan.
