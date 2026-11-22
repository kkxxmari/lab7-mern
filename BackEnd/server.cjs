// This file puts the web server, middleware and movie router together.
// Database details stay in their own module rather than in browser code.
const express = require('express');
const cors = require('cors');
const parser = require('body-parser');
const { mongoose, connectDatabase } = require('./database.cjs');
const movieRoutes = require('./movieRoutes.cjs');

// Build the Express application before registering its request handlers.
// Nothing listens on a port until start runs after the database connection.
const app = express();
// The lab uses port 4000, with PORT available for a local override.
// The shared React API client still needs to point to the chosen port.
const port = Number(process.env.PORT || 4000);

// Allow our local React page to read the API's replies from another port.
// Register CORS first so even an error reply has the expected headers.
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
// Allow ordinary HTML form submissions as well as our React JSON request.
// Keep the same small body limit for both formats.
app.use(parser.urlencoded({ extended: true, limit: '16kb' }));
// JSON parsing fills req.body before POST /api/movies runs.
// Invalid JSON is sent to the error handler instead of reaching the save route.
app.use(parser.json({ limit: '16kb' }));

app.use('/api', (req, res, next) => {
  // If the database connection has gone away, say so gently and clearly.
  // We do not want a page to keep waiting for a query that cannot run.
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'The movie database is unavailable just now.' });
  // Pass control onwards only when a database connection is available.
  // next lets Express continue to the matching movie route.
  next();
});

// Keep the movie work in a separate router, with /api added here once.
// This gives us /api/movies and /api/movie/:id without repeating the prefix.
app.use('/api', movieRoutes);
// This fallback comes after the router so valid movie URLs are tried first.
// An unknown URL gets a JSON 404 response rather than an HTML error page.
app.use((req, res) => res.status(404).json({ error: 'This API route was not found.' }));

// Express recognises error middleware by this four-argument signature.
// Async route failures also arrive here automatically in Express 5.
app.use((error, req, res, next) => {
  // Once a response has started, avoid trying to send a second JSON reply.
  // Hand that situation back to Express with next(error).
  if (res.headersSent) return next(error);
  // Schema validation failures are input problems rather than failed saves.
  // Keep the fields filled in React so the user can make a little correction.
  if (error.name === 'ValidationError') return res.status(400).json({ error: 'Please check the title, year and poster link.' });
  // Parser errors keep their original client-error status codes.
  // These include unreadable, oversized or unsupported request bodies.
  if ([400, 413, 415].includes(error.status)) return res.status(error.status).json({ error: 'The submitted request could not be read.' });
  // Log the error type without printing a private URI or database password.
  // The browser gets a short retry message rather than server details.
  console.error('Movie request failed:', error.name);
  return res.status(503).json({ error: 'We could not reach the movie database. Please try again shortly.' });
});

// Save the listener so shutdown can stop new HTTP requests neatly.
// It is assigned only after the database is ready and app.listen is called.
let listener;
async function start() {
  // Let the database settle into a connected state before serving requests.
  // No connection details or passwords need to appear in the browser bundle.
  await connectDatabase();
  listener = app.listen(port, 'localhost', () => console.log(`API: http://localhost:${port}`));
  // A busy port is a startup problem, so close the database connection too.
  // Mark the process unsuccessful rather than leaving it running silently.
  listener.on('error', () => {
    console.error('The API could not use this port.');
    mongoose.disconnect().finally(() => { process.exitCode = 1; });
  });
}

async function stop() {
  // Finish listening first, then neatly close the database connection.
  // Our saved movies stay in MongoDB, ready for the next time we start.
  if (listener) await new Promise(resolve => listener.close(resolve));
  // Release the driver connection after requests have finished.
  // Closing the connection does not delete any saved documents.
  await mongoose.disconnect();
}

// Run startup only when Node executes server.cjs as the entry point.
// Importing the exported functions for a check will not start a second server.
if (require.main === module) {
  start().catch(async () => {
    console.error('MongoDB could not connect. Please check .env, the running database and Atlas access settings.');
    await mongoose.disconnect();
    process.exitCode = 1;
  });
  // Ctrl+C and a normal termination request use the same cleanup function.
  // once prevents registering repeated cleanup work for the same signal.
  process.once('SIGINT', () => { stop().catch(() => { process.exitCode = 1; }); });
  process.once('SIGTERM', () => { stop().catch(() => { process.exitCode = 1; }); });
}

// Expose the app and lifecycle functions for a controlled local check.
// The normal npm server command still starts this file directly.
module.exports = { app, start, stop };
