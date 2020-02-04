// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// DB filename
const dbFileName = path.join(__dirname, "/db/db.json");

// Routes
// =============================================================
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  fs.readFile(dbFileName, "utf-8", function(err, data){
    if (err) throw err;
    var dataJ = JSON.parse(data);
    return res.json(dataJ);
  });
});


app.post("/api/notes", function(req, res) {
    // New id needs to be assigned as a note from client comes without id. 
    var note = req.body;    
    var data = fs.readFileSync(dbFileName, "utf-8");
    var dataJ = JSON.parse(data);
    note.id = getNewId(dataJ);
    dataJ.push(note);
    
    fs.writeFile(dbFileName, JSON.stringify(dataJ), function(err) {
      if (err) { 
        throw err;
        res.json(false);
      }
      res.json(true);
    })

});

// Get largest ID and plus 1
function getNewId(notes){
  var maxId = 0;
  for (var i=0; i<notes.length; i++){
    if (notes[i].id > maxId) {
      maxId = notes[i].id;
    }     
  }
  maxId++;
  return maxId;
}

app.delete("/api/notes/:id", function(req, res) {
    var id = req.params.id;
    var data = fs.readFileSync(dbFileName, "utf-8");
    var dataJ = JSON.parse(data);
    for (var i=0; i<dataJ.length; i++){
        if (dataJ[i].id == id){
            // If ID is found
            dataJ.splice(i, 1)
            console.log(dataJ);
            fs.writeFileSync(dbFileName, JSON.stringify(dataJ));
            return res.json(true);            
        } 
    }
    // if ID is not found
    return res.status(404).json(false);
});

app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

// This "*" must be at the bottom so that the above routes work.
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
