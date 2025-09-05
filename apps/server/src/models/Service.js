const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Service extends Model {}

Service.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // Menggunakan TEXT untuk deskripsi yang lebih panjang
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // Angka desimal untuk harga
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending', // Status default saat dibuat
      validate: {
        isIn: [['pending', 'approved', 'rejected']],
      },
    },
    // Foreign Key untuk User (Partner)
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Merujuk ke tabel 'users'
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Service',
    tableName: 'services',
    timestamps: true,
  }
);

module.exports = Service;