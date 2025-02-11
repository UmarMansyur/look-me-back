require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');
const port = process.env || 3000;
const morgan = require('morgan');
const { error: errorResponse } = require('./src/utils/response.handler');
const { notFound } = require('./src/utils/api.error');

// use cors
app.use(cors());

// use json
app.use(express.json());

// use morgan
app.use(morgan('dev'));

// use routes
app.use('/', routes);

// error handling 404
app.use((req, _res, _next) => {
    throw notFound(`The requested URL ${req.originalUrl} was not found`);
});

// error handling 500
app.use((error, _req, res) => {
    return errorResponse(res, error.message, error.status || 500);
});

// listen on port 3000
app.listen(port, () => {
    console.log('Server is running on port 3000');
});