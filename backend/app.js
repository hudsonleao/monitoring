global.NODE_PORT = process.env.NODE_PORT || 8065;
const express = require('./config/express');
const app = express();
const cors = require('cors');

app.use(cors());

app.listen(global.NODE_PORT, () => console.log('Monitoring @ port ' + global.NODE_PORT));
