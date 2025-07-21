const express = require('express');
const path = require('path');

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.route');





require('dotenv').config();
const app = express();
app.use(express.json());


connectDB();

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'html');


// Backend health check
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
