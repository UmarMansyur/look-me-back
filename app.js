require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./src/routes');
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const { error: errorResponse } = require('./src/utils/response.handler');
const { notFound } = require('./src/utils/api.error');

app.use(cors());

app.use(express.json());

app.use(morgan('dev'));

app.use('/', routes);

app.use((req, _res, _next) => {
    throw notFound(`The requested URL ${req.originalUrl} was not found`);
});

app.use((error, _req, res, _next) => {
    console.log(error.stack)
    return errorResponse(res, error.message, error.statusCode || 500);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});