// Import necessary NPM packages
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Initialize Express.js app and define port
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for data parsing in Express.js
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API route to retrieve notes from the JSON file
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// API route to create a new note with a unique ID and save it in the JSON file
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Assign a unique ID to the note
  
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

// API route to delete a note from the JSON file based on its unique ID
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

// HTML route to display notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// HTML route to display the home page
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
