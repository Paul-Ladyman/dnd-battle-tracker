const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/../dist-final/dnd-battle-tracker.html'));
});
app.use(express.static('dist-final'));

app.listen(port, () => {});
