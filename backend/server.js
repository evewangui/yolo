const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoute = require('./routes/api/productRoute');

// MongoDB connection (Docker container name)
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://app-ip-mongo:27017/yolomy';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Database connected successfully'))
.catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'YOLO E-commerce API',
        status: 'running',
        endpoints: { products: '/api/products' }
    });
});

// API routes
app.use('/api/products', productRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`MongoDB URI: ${MONGODB_URI}`);
});
