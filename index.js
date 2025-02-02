const connectTomongo = require('./database');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3003;

connectTomongo();

// Enable CORS
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hey we are connected to the shop promoter apk');
});

app.use('/api/user', require('./routes/User'));
app.use('/api/Group', require('./routes/Group'));
app.use('/api/items', require('./routes/shopitem'));
app.use('/api/email', require('./routes/email'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
