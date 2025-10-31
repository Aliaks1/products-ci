const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
//const categoryRoutes = require('./routes/categoryRoutes');

const { errorResponse } = require('./middlewares/errorFormatter');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'products-backend' }));

app.use('/api/products', productRoutes);
//app.use('/api/categories', categoryRoutes);

app.use((req, res) => errorResponse(res, 404, 'Not Found'));

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend działa na porcie ${PORT}`));
}
module.exports = app;
