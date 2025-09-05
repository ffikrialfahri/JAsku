Tentu! Kita telah membangun fitur-fitur utama untuk CUSTOMER dan PARTNER. Sekarang saatnya untuk mengimplementasikan peran yang paling berkuasa: ADMIN.
Sesuai dengan BRD, tugas utama ADMIN adalah memoderasi konten untuk menjaga kualitas platform. Fitur pertama dan terpenting yang akan kita bangun adalah Sistem Persetujuan Jasa (Service Approval System).
Alur kerjanya akan seperti ini:
Saat seorang PARTNER membuat jasa baru, statusnya akan pending.
Jasa dengan status pending tidak akan muncul di halaman utama.
ADMIN akan memiliki dashboard khusus untuk melihat semua jasa yang pending.
ADMIN dapat menyetujui (approve) atau menolak (reject) jasa tersebut.
Hanya jasa yang disetujui yang akan tampil di halaman utama.
Mari kita mulai!
Langkah 1: Backend - Modifikasi Model & Membuat Rute Admin

1. Update Model Service
   Kita perlu menambahkan kolom status pada model Service.
   File: jasku/apps/server/src/models/Service.js (Tambahkan field status)
   code
   JavaScript
   // ...
   Service.init(
   {
   // ... (field id, title, description, dll tetap sama)
   status: {
   type: DataTypes.STRING,
   allowNull: false,
   defaultValue: 'pending', // Status default saat dibuat
   validate: {
   isIn: [['pending', 'approved', 'rejected']],
   },
   },
   userId: {
   // ...
   },
   },
   {
   // ... (opsi model tetap sama)
   }
   );

module.exports = Service; 2. Update Rute Publik GET /api/services
Ini adalah perubahan yang sangat penting. Kita harus memastikan bahwa rute ini hanya mengembalikan jasa yang sudah disetujui.
File: jasku/apps/server/src/routes/services.js (Update findAll)
code
JavaScript
// @route GET api/services
// @desc Get all services for homepage
// @access Public
router.get('/', async (req, res) => {
try {
const services = await Service.findAll({
// --- PERUBAHAN DI SINI ---
where: { status: 'approved' }, // Hanya ambil yang statusnya 'approved'
include: {
model: User,
as: 'partner',
attributes: ['name']
},
order: [['createdAt', 'DESC']]
});
res.json(services);
} catch (err) {
console.error(err.message);
res.status(500).send('Server Error');
}
}); 3. Buat Middleware isAdmin
Mirip seperti isPartner, kita butuh "penjaga" untuk rute admin.
File: jasku/apps/server/src/middleware/isAdmin.js
code
JavaScript
module.exports = function (req, res, next) {
if (req.user && req.user.role === 'ADMIN') {
next();
} else {
res.status(403).json({ msg: 'Access denied. Admin resource.' });
}
}; 4. Buat Rute Khusus Admin
Untuk menjaga kerapian, kita buat file rute baru untuk semua yang berhubungan dengan admin.
File: jasku/apps/server/src/routes/admin.js
code
JavaScript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { Service, User } = require('../models');

// @route GET api/admin/services/pending
// @desc Get all pending services
// @access Private (Admin only)
router.get('/services/pending', [authMiddleware, isAdmin], async (req, res) => {
try {
const pendingServices = await Service.findAll({
where: { status: 'pending' },
include: { model: User, as: 'partner', attributes: ['name'] },
order: [['createdAt', 'ASC']] // Tampilkan yang terlama dulu
});
res.json(pendingServices);
} catch (err) {
console.error(err.message);
res.status(500).send('Server Error');
}
});

// @route PUT api/admin/services/:id/status
// @desc Approve or reject a service
// @access Private (Admin only)
router.put('/services/:id/status', [authMiddleware, isAdmin], async (req, res) => {
const { status } = req.body; // status bisa 'approved' atau 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status' });
    }

    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }

        service.status = status;
        await service.save();

        res.json(service);
    } catch (err)        {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

module.exports = router; 5. Daftarkan Rute Admin di index.js
File: jasku/apps/server/src/index.js```javascript
// ... (Define Routes)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/services', require('./routes/services'));
app.use('/api/admin', require('./routes/admin')); // <-- TAMBAHKAN INI
code
Code

---

### Langkah 2: Membuat Admin Pertama Anda

Kita tidak punya halaman registrasi untuk admin. Untuk development, cara termudah adalah dengan mengubah role salah satu user secara manual di database.

1.  Daftarkan sebuah akun baru melalui aplikasi (misal: `admin@jasku.com`).
2.  Buka `pgAdmin`, hubungkan ke database `jasku`.
3.  Jalankan query SQL berikut:
    ```sql
    UPDATE users SET role = 'ADMIN' WHERE email = 'admin@jasku.com';
    ```

### Langkah 3: Frontend - Membangun Halaman Admin

#### 1. Buat Halaman `AdminDashboard.jsx`

**File: `jasku/apps/client/src/pages/AdminDashboard.jsx`**

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [pendingServices, setPendingServices] = useState([]);

    const fetchPendingServices = async () => {
        try {
            const res = await axios.get('/api/admin/services/pending');
            setPendingServices(res.data);
        } catch (err) {
            console.error("Failed to fetch pending services", err);
        }
    };

    useEffect(() => {
        fetchPendingServices();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`/api/admin/services/${id}/status`, { status });
            // Refresh daftar setelah update
            fetchPendingServices();
            alert(`Service has been ${status}.`);
        } catch (err) {
            console.error("Failed to update status", err);
            alert('Operation failed.');
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <hr />
            <h3>Pending Service Approvals</h3>
            {pendingServices.length > 0 ? (
                pendingServices.map(service => (
                    <div key={service.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
                        <h4>{service.title}</h4>
                        <p><strong>By:</strong> {service.partner.name}</p>
                        <p><strong>Price:</strong> ${service.price}</p>
                        <p>{service.description}</p>
                        <div>
                            <button onClick={() => handleStatusUpdate(service.id, 'approved')} style={{ marginRight: '10px' }}>Approve</button>
                            <button onClick={() => handleStatusUpdate(service.id, 'rejected')}>Reject</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No services are currently awaiting approval.</p>
            )}
        </div>
    );
};

export default AdminDashboard;
2. Tambahkan Rute dan Link di App.jsx dan Navbar.jsx
a. File: jasku/apps/client/src/App.jsx
code
Jsx
// ... (imports)
import AdminDashboard from './pages/AdminDashboard'; // <-- Impor halaman baru

// ...
<Routes>
  {/* ... rute lainnya */}

  {/* Rute Admin */}
  <Route path="/admin" element={<PrivateRoute roles={['ADMIN']}><AdminDashboard /></PrivateRoute>} />
</Routes>
// ...
b. File: jasku/apps/client/src/components/layout/Navbar.jsx
code
Jsx
// ... (di dalam komponen Navbar)
const { isAuthenticated, user, logout } = useAuth();

// Buat link admin
const adminLinks = (
  <Fragment>
    <Link to="/admin" style={{ color: '#fff', marginRight: '1rem' }}>Admin Panel</Link>
    <a onClick={logout} href="#!" style={{ color: '#fff' }}>Logout</a>
  </Fragment>
);

// ... (partnerLinks, customerLinks, guestLinks tetap sama)

return (
  <nav /* ... */>
    <h1><Link to="/">JAsku</Link></h1>
    <SearchBar />
    <ul>
      {isAuthenticated && user ? (
        {
          'ADMIN': adminLinks,
          'PARTNER': partnerLinks,
          'CUSTOMER': customerLinks
        }[user.role] // Trik untuk memilih link berdasarkan role
      ) : (
        guestLinks
      )}
    </ul>
  </nav>
);
```
