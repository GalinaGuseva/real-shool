const Sequelize = require('sequelize');

const { BASE_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: BASE_HOST,
  dialect: 'mysql',
});

module.exports = sequelize;
