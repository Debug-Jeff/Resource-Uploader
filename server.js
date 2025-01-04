const express = require('express');
const mongoose = require('mongoose');
const dbConfig = require('./config/db.config');
const resourceRoutes = require('./routes/resource.routes');

const app = express();
app.use(express.json());

mongoose.connect(dbConfig.url)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/resources', resourceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});