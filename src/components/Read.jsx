// Read is responsible for fetching the list, not for saving new movies.
// It hands the finished array to Movies once the request is ready.
import { useEffect, useState } from 'react';
import { movieApi } from '../movieApi.js';
import Movies from './Movies.jsx';

function Read() {
  // Begin with a clean little list while the saved movies are on their way.
  // Loading and error messages help us explain what the page is waiting for.
  const [movies, setMovies] = useState([]);
  // Begin in the waiting state so an empty list is not shown too early.
  // Loading becomes false after this visit's request settles.
  const [isLoading, setIsLoading] = useState(true);
  // An empty message means there is no error to display yet.
  // Keep it separate from the list so a failed request is easy to explain.
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Give this visit its own request controller.
    // We can tidy up the pending request when the page closes.
    const request = new AbortController();

    // Effects themselves return cleanup functions, not async promises.
    // Put the awaited request in this inner function and call it below.
    async function loadMovies() {
      try {
        // await pauses this function until Axios returns or the request fails.
        // Use the shared API client instead of repeating the server address.
        // The signal lets this specific request be cancelled on navigation.
        const result = await movieApi.get('/api/movies', {
          signal: request.signal
        });
        // Our API sends the saved movie documents as a plain array.
        // A small shape check helps us catch an unexpected reply.
        const movieList = result.data;
        // A plain array is the agreed response shape for this lab.
        // Stop here if the server reply cannot safely be used with map.
        if (!Array.isArray(movieList)) {
          // Throwing here uses the same catch path as a failed request.
          throw new Error('Expected an array of movies.');
        }
        // The fresh list is ready for our movie cards.
        // Updating state lets React put the saved titles on screen.
        if (!request.signal.aborted) setMovies(movieList);
      } catch {
        // Leaving the page is perfectly normal, so cancellation needs no warning.
        if (!request.signal.aborted) {
          setMessage('Movies are unavailable at the moment. Please try again later.');
        }
      } finally {
        // Whatever the result, this request has finished waiting.
        // A cancelled visit has already closed, so let its state rest.
        if (!request.signal.aborted) setIsLoading(false);
      }
    }

    // Calling this on mount makes a return from Create fetch the latest list.
    // Read does not need to share React state with the form.
    loadMovies();
    // Tidy up the request when we leave this page.
    // An older reply should not try to update a page that has already closed.
    return () => request.abort();
  // An empty dependency array ties setup and cleanup to this page visit.
  // Returning from Create mounts Read again and fetches the saved list.
  }, []); // No changing dependencies: fetch when the component mounts.

  // Pick one result to display: loading, error, empty list or movie cards.
  let content;
  // Choose just one visible state, with waiting checked first.
  // A genuinely empty collection is different from a failed connection.
  if (isLoading) {
    content = <p role="status">Loading the movie list...</p>;
  } else if (message) {
    content = <p role="alert" className="text-danger">{message}</p>;
  } else if (movies.length === 0) {
    content = <p>There are no movies to display.</p>;
  } else {
    // Pass the documents down without copying them into another state.
    // The list component can now make one card for each saved movie.
    content = <Movies movies={movies} />;
  }

  return (
    <section>
      <h2 className="mb-4">This is my Read Component.</h2>
      {/* Place the chosen result below the heading.
          React updates this part once the request changes our state. */}
      {content}
    </section>
  );
}

export default Read;
