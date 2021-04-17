const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();
const path = require('path');
const config = require('dotenv').config();
const helmet = require("helmet");
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

const Mydb_USER = process.env.MySQLdb_USER;
const Mydb_PASSWORD = process.env.MySQLdb_PASSWORD;

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('groupomania', Mydb_USER, Mydb_PASSWORD, {
  dialect: 'mysql',
  dialectOptions: {
    // Your mysql2 options here
  }
});

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());
app.use(helmet());

module.exports = app;

app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);