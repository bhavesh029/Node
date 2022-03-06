const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete','admin','password', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;