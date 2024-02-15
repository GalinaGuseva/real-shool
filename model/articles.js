const Sequelize = require('sequelize');
const sequelize = require('./connect');

const articles = sequelize.define('Articles', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  img: Sequelize.STRING,
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  text: Sequelize.TEXT,
});

module.exports = articles;
