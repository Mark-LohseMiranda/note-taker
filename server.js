const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
let noteData = require("./db/db.json");
const uuid = require("./helpers/uuid");

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const readFromFile = util.promisify(fs.readFile);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => {
    noteData = JSON.parse(data);
    res.json(noteData);
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const newNote = { title, text, id: uuid() };
  noteData.push(newNote);
  const noteString = JSON.stringify(noteData);
  fs.writeFile(`./db/db.json`, noteString, (err) =>
    err ? console.error(err) : console.log("success")
  );
  res.status(201).json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  noteData = noteData.filter((remove) => remove.id !== id);
  const noteString = JSON.stringify(noteData);
  fs.writeFile(`./db/db.json`, noteString, (err) =>
    err ? console.error(err) : console.log("success")
  );
  res.status(201).json(noteData);
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => console.log(`chillin at http://localhost:${PORT}`));
