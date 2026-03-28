import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import './Watchlist.scss';

const Watchlist = () => {
  const { watchlist } = useWatchlist();

  useEffect(() => {
    document.title = "Minha Lista | MovieSearch";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1>Minha Lista</h1>
        <p>Filmes que você salvou para assistir depois.</p>
      </div>

      {watchlist.length === 0 ? (
        <div className="empty-state">
          <h2>Sua lista está vazia</h2>
          <p>Explore filmes e adicione-os à sua lista para encontrá-los rapidamente.</p>
          <Link to="/" className="browse-btn">Explorar Filmes</Link>
        </div>
      ) : (
        <div className="movies-grid">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              releaseDate={movie.release_date}
              voteAverage={movie.vote_average}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
