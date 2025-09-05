const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

class User extends Model {}

User.init(
  {
    // Definisi atribut model
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'CUSTOMER',
      validate: {
        isIn: [['CUSTOMER', 'PARTNER', 'ADMIN']],
      },
    },
  },
  {
    // Opsi model
    sequelize, // Kita perlu meneruskan koneksi instance
    modelName: 'User', // Kita perlu memilih nama model
    tableName: 'users',
    timestamps: true, // Sequelize akan menambahkan createdAt dan updatedAt secara otomatis
    hooks: {
      // Menggunakan hook 'beforeCreate' untuk hash password
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Method untuk memvalidasi password (bisa ditambahkan di sini)
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}


module.exports = User;