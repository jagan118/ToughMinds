const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes')
const todoRoutes = require('./routes/todoRoutes');

dotenv.config();

const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',authRoutes)
app.use('/api/todos',todoRoutes)

app.get('/', (req, res) => {
    res.send('API Running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

