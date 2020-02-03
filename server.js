// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =============================================================
var id = 1;
var db = [
  {
    id: 1,
    title: "Title111",
    text: "NoteText111",
  },
  {
    id: 2,
    title: "Title222",
    text: "NoteText222",
  },
  {
    id: 3,
    title: "Title333",
    text: "NoteText333",
  }
];

// Routes
// =============================================================
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    return res.json(db);
});

app.post("/api/notes", function(req, res) {
    var note = req.body;
    console.log(note.id);
    id++;
    note.id = id;
    console.log(note);
    db.push(note);
    res.json(note);
});

app.delete("/api/notes/:id", function(req, res) {
    var id = req.params.id;
    for (var i=0; i<db.length; i++){
        if (db[i].id == id){
            // If ID is found
            console.log("deleting ", db[i]);
            db.splice(i, 1)
            console.log(db);
            return res.json(true);            
        } 
    }
    // if ID is not found
    return res.json(false);
});

app.get("/assets/css/styles.css", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/assets/css/styles.css"));
});

app.get("/assets/js/index.js", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/assets/js/index.js"));
});

// This "*" must be at the bottom so that the above routes work.
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
