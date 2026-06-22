require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on http://localhost:${PORT}`);
});
