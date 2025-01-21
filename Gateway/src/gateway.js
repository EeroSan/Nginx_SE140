const express = require('express');
const routes = require('./routes');
const app = express();

const PORT = process.env.PORT || 8197
// app.use(express.json());
app.use(express.text());
app.use('/', routes);

if(process.env.RUN_TESTS === "NO")
{
    app.listen(PORT, () => {
        console.log(`API Gateway is running on http://localhost:${PORT}`);
    
    });
} else
{
    console.log("Skipping app.listen")
}


module.exports = app;