const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO)
  .then(() => {
    app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
  })
  .catch(err => console.error('Error al conectar con MongoDB', err));
