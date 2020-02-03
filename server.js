// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// DB filename
const dbFileName = path.join(__dirname, "/db/db.json");

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
  fs.readFile(dbFileName, "utf-8", function(err, data){
    if (err) throw err;
    console.log("fs.readFile: " , dbFileName, data);
    var dataJ = JSON.parse(data);
    return res.json(dataJ);
  });
});


app.post("/api/notes", function(req, res) {
    // New id needs to be assigned as a note from client comes without id. 
    var note = req.body;
    console.log("post note: ", note);
    
    // Get largest id num
    var data = fs.readFileSync(dbFileName, "utf-8");
    console.log("fs.readFile: " , dbFileName, data);
    var dataJ = JSON.parse(data);
    note.id = getNewId(dataJ);
    dataJ.push(note);
    console.log("dataJ: ",dataJ);
    
    fs.writeFile(dbFileName, JSON.stringify(dataJ), function(err) {
      if (err) { 
        throw err;
        res.json(false);
      }
      res.json(true);
    })

});

function getNewId(notes){
  var maxId = 0;
  var id = 0;
  for (var i=0; i<notes.length; i++){
    if (notes[i].id > maxId) {
      maxId = notes[i].id;
    }     
  }
  id = maxId + 1;
  return id;
}

// Fix this to use the file. 
app.delete("/api/notes/:id", function(req, res) {
    var id = req.params.id;
    console.log("delete id: ", id);
    var data = fs.readFileSync(dbFileName, "utf-8");
    var dataJ = JSON.parse(data);
    for (var i=0; i<dataJ.length; i++){
        if (dataJ[i].id == id){
            // If ID is found
            console.log("deleting ", dataJ[i]);
            dataJ.splice(i, 1)
            console.log(dataJ);
            fs.writeFileSync(dbFileName, JSON.stringify(dataJ));
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
