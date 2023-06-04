const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

const path = require('path');

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
