const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/notes');
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

// Define the Note schema and model
const noteSchema = new mongoose.Schema({
  title: String,
  body: String,
  categories: String,
  tags: String,
});

const Note = mongoose.model('Note', noteSchema);

// Routes
app.get('/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.post('/notes', async (req, res) => {
  const note = new Note(req.body);
  await note.save();
  res.json(note);
});

app.put('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const note = await Note.findByIdAndUpdate(id, req.body, { new: true });
  res.json(note);
});

app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  await Note.findByIdAndDelete(id);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
