const config = require('dotenv').config();
const Mydb_USER = process.env.MySQLdb_USER;
const Mydb_PASSWORD = process.env.MySQLdb_PASSWORD;
const { Sequelize } = require('sequelize');

var sequelize = new Sequelize('groupomania', Mydb_USER, Mydb_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,//passer a true pour voir les différentes requêtes effectuées par l'ORM
    });
    
module.exports = sequelize;