const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    
    fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), err => {
      if (err) throw err;
      res.status(200).json(newNote);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);
    
    fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), err => {
      if (err) throw err;
      res.status(200).end();
    });
  });
});

// HTML routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
