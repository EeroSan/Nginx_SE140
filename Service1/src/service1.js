const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8199;

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Service1 is running on http://localhost:${PORT}`);
});