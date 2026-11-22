// This page owns the form values and the feedback from its save request.
// Keeping both here makes the form feel tidy and easy to follow.
import { useState } from 'react';
import { movieApi } from '../movieApi.js';

// A shared empty shape gives all three controlled inputs a starting value.
// We reuse it after a successful save instead of resetting fields separately.
const emptyMovie = { title: '', year: '', poster: '' };

function Create() {
  // Keep the three movie fields together in one tidy object.
  // This makes it easy to send the whole form when it is ready.
  const [movie, setMovie] = useState(emptyMovie);
  // Keep a friendly message beside the result of our request.
  // A null result means there is nothing to announce yet.
  // Keep the waiting flag separate so the submit button can pause politely.
  const [result, setResult] = useState(null);
  // While this is true, the form waits for the server to finish.
  // That also keeps a second click from starting another save.
  const [isSending, setIsSending] = useState(false);

  function updateMovie(event) {
    // The input name tells us which little piece of the form changed.
    // The other two values can stay just as they were.
    const { name, value } = event.target;
    // Change one field without clearing the other two.
    // Use the latest state supplied by React rather than an older render.
    // The spread keeps the other fields, and [name] changes the chosen one.
    setMovie((current) => ({ ...current, [name]: value }));
    // Clear the old message once the user starts editing again.
    setResult(null);
  }

  function submitMovie(event) {
    // Leave the browser on Create and send the request from this handler.
    // Only the submit button should start a save, never an ordinary render.
    event.preventDefault();
    // Ignore another submit while the first request is still pending.
    // The disabled fieldset below gives the same protection in the browser.
    if (isSending) return;

    // Remove extra spaces from the text fields before making the request.
    // Keep the year as a string, like the years in the starter data.
    // The API schema expects lowercase property names for these values.
    // Build a fresh object so the request is separate from the editable state.
    const details = {
      // Trim only the outer spaces; spaces inside a title still belong to it.
      title: movie.title.trim(),
      // A number input still provides a string through event.target.value.
      year: movie.year,
      // Store the picture address rather than downloading the image here.
      poster: movie.poster.trim()
    };
    // Clear feedback from an earlier attempt before this request starts.
    // The waiting flag now belongs to this particular submission.
    setResult(null);
    setIsSending(true);

    // Axios serialises our plain object as a JSON request body.
    // The shared client supplies localhost:4000 and the request timeout.
    movieApi.post('/api/movies', details)
      .then(({ data }) => {
        // Everything saved nicely, so we can give the form a fresh start.
        // Read the saved title from the movie inside the server reply.
        setMovie(emptyMovie);
        // Only show success after the database has accepted the movie.
        // The server reply wraps that saved document inside data.movie.
        setResult({ error: false, text: `Added ${data.movie.title}.` });
      })
      .catch((error) => {
        // Sometimes the API is simply not available yet.
        // Keep the typed details safe and show a gentle message for another try.
        // Optional chaining also works when a network error has no response.
        // Keep a fallback message ready for that case.
        setResult({ error: true, text: error.response?.data?.error || 'The movie could not be saved. Is the API running?' });
      })
      // Let the form wake up after either a save or an error.
      // finally keeps this little cleanup in one place for both outcomes.
      .finally(() => setIsSending(false));
  }

  return (
    <section className="movie-form">
      <h2 className="mb-4">This is my Create Component.</h2>
      {/* Use a real form so Enter and the submit button share one handler.
          Required fields are checked by the browser before onSubmit runs. */}
      <form onSubmit={submitMovie}>
        {/* Lock the fields while the POST is pending to prevent repeat clicks. */}
        <fieldset disabled={isSending}>
          {/* Keep the input linked to its matching state value.
              updateMovie makes the change without losing the rest of the form. */}
          <div className="mb-3">
            {/* Matching htmlFor and id makes this label focus its own input. */}
            <label className="form-label" htmlFor="title">Add Movie Title:</label>
            {/* The pattern needs at least one non-space character in the title. */}
            <input className="form-control" id="title" name="title" type="text"
              value={movie.title} onChange={updateMovie} required maxLength={200}
              pattern=".*\S.*" title="Please provide the movie title." />
          </div>
          {/* Help the browser catch a year that is not a whole number.
              The schema will also check this before saving to MongoDB. */}
          <div className="mb-3">
            <label className="form-label" htmlFor="year">Add Movie Year:</label>
            {/* step=1 accepts whole years, with the same range as the schema. */}
            <input className="form-control" id="year" name="year" type="number"
              value={movie.year} onChange={updateMovie}
              min="1888" max="9999" step="1" required />
          </div>
          {/* This field takes the picture address, not an uploaded file.
              A full HTTP or HTTPS link gives the card somewhere to load its poster. */}
          <div className="mb-3">
            <label className="form-label" htmlFor="poster">Add Movie Poster:</label>
            {/* type=url checks the address; the pattern limits its protocol. */}
            <input className="form-control" id="poster" name="poster" type="url"
              value={movie.poster} onChange={updateMovie} required maxLength={2048}
              pattern="https?://.+" title="Use a full HTTP or HTTPS poster link." />
          </div>
          {/* A small label change shows that the request is still in progress. */}
          <button className="btn btn-dark" type="submit">{isSending ? 'Adding...' : 'Add Movie'}</button>
        </fieldset>
      </form>
      {/* Screen readers announce the response without changing focus. */}
      {/* Render no feedback paragraph until a request gives us a result.
          The error flag chooses its announcement role and text colour. */}
      {result && <p role={result.error ? 'alert' : 'status'} className={result.error ? 'mt-3 mb-0 text-danger' : 'mt-3 mb-0'}>{result.text}</p>}
    </section>
  );
}

export default Create;
