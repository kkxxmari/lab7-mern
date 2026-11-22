// Reuse the same card component for every document in the list.
// The list does not need to know how an individual poster is displayed.
import MovieItem from './MovieItem.jsx';

function Movies({ movies }) {
  // Take the saved movie list passed down from Read.
  // Keeping this component small lets each card take care of its own poster.
  return (
    <div className="movie-list">
      {/* Each card receives one object from Read's movie array. */}
      {/* Each little movie card gets its stable MongoDB _id as the key. */}
      {/* map turns each document into JSX without changing the array.
          The MongoDB key stays stable if React needs to render it again. */}
      {movies.map((movie) => (
        // Only this movie document is passed to this particular card.
        <MovieItem key={movie._id} movie={movie} />
      ))}
    </div>
  );
}

export default Movies;
