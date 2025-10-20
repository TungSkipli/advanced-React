const express = require('express');
const cors = require("cors");
const {db} = require('./config/firebase');
const authRoutes = require("./routes/authRoutes");

const app = express();



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.send('Hello World!');
})

app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server`
  });
});

module.exports = app;