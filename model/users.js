const Sequelize = require('sequelize');
const sequelize = require('./connect');

const users = sequelize.define('Users', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  login: Sequelize.STRING,
  pass: Sequelize.STRING,
  email: Sequelize.STRING,
  avatarUrl: Sequelize.STRING,
  resetToken: Sequelize.STRING,
  resetExp: Sequelize.DATE,
});

module.exports = users;
