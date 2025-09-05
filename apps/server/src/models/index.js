const { sequelize } = require('../config/db');
const User = require('./User');
const Service = require('./Service');

// Definisikan relasi
// Seorang User (Partner) memiliki banyak Service
User.hasMany(Service, {
  foreignKey: 'userId',
  as: 'services' // Alias untuk relasi
});

// Sebuah Service dimiliki oleh satu User (Partner)
Service.belongsTo(User, {
  foreignKey: 'userId',
  as: 'partner' // Alias untuk relasi
});

// Ekspor semua model dan koneksi sequelize
module.exports = {
  sequelize,
  User,
  Service
};