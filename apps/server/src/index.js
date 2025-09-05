require('dotenv').config();
const express = require('express');
const { sequelize, connectDB } = require('./config/db');
const cors = require('cors');

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from JAsku API!' });
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/services', require('./routes/services'));
app.use('/api/admin', require('./routes/admin'));

const port = process.env.PORT || 3001;

// Memulai server setelah koneksi DB dan sinkronisasi model berhasil
const startServer = async () => {
  await connectDB();
  
  // Sinkronisasi model dengan database. Ini akan membuat tabel jika belum ada.
  // Gunakan { force: true } hanya saat development untuk drop dan re-create tabel.
  await sequelize.sync(); 
  console.log("All models were synchronized successfully.");

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();