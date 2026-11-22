// Collect the movie endpoints in one router to keep server.cjs easy to read.
// The server will mount this router below the shared /api prefix.
const express = require('express');
const Movie = require('./Movie.cjs');
const { mongoose } = require('./database.cjs');

// A router groups handlers but does not open its own listening port.
// Requests reach these handlers through the main Express application.
const routes = express.Router();

routes.get('/movies', async function listMovies(req, res) {
  // The empty filter brings back all the movies we have saved so far.
  // Sorting by _id keeps the cards in a predictable order on the Read page.
  const savedMovies = await Movie.find({}).sort({ _id: 1 }).lean();
  // lean gives us plain objects suitable for a JSON response.
  // Send the array directly, including [] when no movies exist yet.
  res.json(savedMovies);
});

routes.post('/movies', async function saveMovie(req, res) {
  // The body parser has already decoded the incoming JSON or form fields.
  // A missing body is still possible, so the checks below allow for it.
  const values = req.body;
  // Give the form a helpful reply if one of its values has the wrong type.
  // Taking only the named fields also keeps extra request properties out.
  if (['title', 'year', 'poster'].some(key => typeof values?.[key] !== 'string')) {
    return res.status(400).json({ error: 'Please send a title, year and poster as text.' });
  }
  // Make a fresh document from just the three allowed properties.
  // Ignore any extra submitted _id or other fields rather than copying them.
  const movie = new Movie({ title: values.title, year: values.year, poster: values.poster });

  // Wait until MongoDB has safely accepted this movie before celebrating.
  // The saved document comes back with the _id needed by our React cards.
  await movie.save();
  // A 201 reply means the database accepted a new record.
  // React uses movie.title from this envelope for its success message.
  return res.status(201).json({ message: 'Movie created successfully', movie });
});

routes.get('/movie/:id', async function findMovie(req, res) {
  // First check the shape of the ID so a typo gets a useful 400 response.
  // A well-shaped ID can still belong to no movie, which is a 404 instead.
  const id = req.params.id;
  if (!mongoose.isObjectIdOrHexString(id)) return res.status(400).json({ error: 'Please use a valid movie ID.' });
  // findById uses the document _id rather than a title or array position.
  // Await the query before deciding whether we have a movie to return.
  const savedMovie = await Movie.findById(id).lean();
  if (savedMovie === null) return res.status(404).json({ error: 'That movie was not found.' });
  // Return the one found document in the same shape used by the list.
  // There is no need to wrap a single result inside an extra array.
  return res.json(savedMovie);
});

// Export the ready router for app.use in server.cjs.
// The handlers stay in this module even though their public URLs start /api.
module.exports = routes;
