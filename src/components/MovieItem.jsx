// The card reads the lowercase fields returned by our Mongoose model.
// It only handles presentation; the Read page already did the fetching.
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';

function MovieItem({ movie }) {
  // Keep the poster result with the card it belongs to.
  // If a picture cannot load, the movie details can still stay on screen.
  const [imageError, setImageError] = useState(false);
  // Check for an address before asking the browser to load the picture.
  // Older data may still use N/A where a poster would normally be.
  const showPoster = movie.poster && movie.poster !== 'N/A' && !imageError;

  // Repeat the log only if the supplied movie object changes.
  // This is a development log after render, rather than a database query.
  // Its dependency makes it run again when this card receives another object.
  useEffect(() => {
    console.log('Movie details:', movie);
  }, [movie]);

  return (
    <Card className="h-100">
      {/* Use a heading element so the movie title also has page structure. */}
      <Card.Header as="h3" className="h5">{movie.title}</Card.Header>
      <Card.Body>
        {/* An unavailable image should not hide the movie's details. */}
        {showPoster ? (
          // The error handler switches to the text fallback if the image fails.
          // Image dimensions reserve space, and lazy loading delays off-screen posters.
          <img className="movie-poster" src={movie.poster} alt={movie.title}
            width="300" height="450" loading="lazy" onError={() => setImageError(true)} />
        ) : (
          // A gentle fallback keeps the card useful even without a picture.
          <p className="missing-poster">No poster available</p>
        )}
      </Card.Body>
      {/* The release year belongs to the same document as the title above. */}
      <Card.Footer>{movie.year}</Card.Footer>
    </Card>
  );
}

export default MovieItem;
