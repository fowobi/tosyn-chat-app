const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;


const dataDirectory = path.join(__dirname, "data");
const dbPath = path.join(dataDirectory, "db.json");

// Ensure the data directory and db.json file exist
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory);
}

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, "[]");
}

const messages = JSON.parse(fs.readFileSync(dbPath, "utf8"));


function validateMessage(req, res, next) {
  const { from, text } = req.body;
  if (!from || !text) {
    return res
      .status(400)
      .json({ error: "Both 'from' and 'text' fields are required." });
  }
  next();
}
// app.get("/", function (request, response) {
//   response.send("Chat server is running! 🚀.");
// });


app.get('/', function(request, response) {
  response.send("Chat server is running! 🚀.");
  response.sendFile(__dirname + '/index.html');
  
});

app.get("/messages", function (req, res) {
  res.json(messages);
});


app.post("/messages", validateMessage, function (req, res) {
  const newMessage = req.body;
  newMessage.id = messages.length;
  newMessage.timeSent = new Date(); // Store as a Date object
  messages.push(newMessage);

  // Write messages to the db.json file
  fs.writeFileSync(dbPath, JSON.stringify(messages, null, 2));

  res.json(newMessage);
});

app.get("/messages/search", function (req, res) {
  const searchText = req.query.text;
  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchText.toLowerCase())
  );
  res.json(filteredMessages);
});


app.get("/messages/:id", function (req, res) {
  const id = parseInt(req.params.id);
  const message = messages.find((msg) => msg.id === id);
  if (!message) {
    return res.status(404).json({ error: "Message not found." });
  }
  res.json(message);
});


app.get("/messages/latest", function (req, res) {
  // Sort messages by timeSent in descending order (newest first)
  const sortedMessages = messages.sort((a, b) => b.timeSent - a.timeSent);
  // Get the last 10 messages
  const latestMessages = sortedMessages.slice(0, 10);
  res.json(latestMessages);
});

app.put("/messages/:id", validateMessage, function (req, res) {
  const id = parseInt(req.params.id);
  const index = messages.findIndex((msg) => msg.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Message not found." });
  }

  
  const updatedMessage = req.body;
  messages[index] = {
    ...messages[index],
    ...updatedMessage,
    id,
    timeSent: messages[index].timeSent,
  };
  res.json(messages[index]);
});

app.delete("/messages/:id", function (req, res) {
  const id = parseInt(req.params.id);
  const index = messages.findIndex((msg) => msg.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Message not found." });
  }
  messages.splice(index, 1);
  res.json({ message: "Message deleted successfully." });
});


// Default error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong." });
});

// app.listen(process.env.PORT);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
