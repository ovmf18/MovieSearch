import { useState, useEffect } from 'react';
import { movieService } from '../services/api';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import './TopRated.scss';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

const TopRated = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTopRated = async (currentPage: number) => {
    try {
      currentPage === 1 ? setLoading(true) : setLoadingMore(true);

      const response = await movieService.getTopRated(currentPage);
      const newMovies = response.results;
      setTotalPages(response.total_pages);

      setMovies(prev => {
        const combined = currentPage === 1 ? newMovies : [...prev, ...newMovies];

        // Remover duplicatas
        return combined.filter((movie: Movie, index: number, self: Movie[]) =>
          index === self.findIndex((m) => m.id === movie.id)
        );
      });

    } catch (error) {
      console.error("Erro ao buscar melhores filmes:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTopRated(1);
    window.scrollTo(0, 0);
  }, []);

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTopRated(nextPage);
    }
  };

  if (loading && page === 1) {
    return <div className="loading">Carregando as lendas do cinema...</div>;
  }

  const firstMovie = movies[0];
  const restOfMovies = movies.slice(1);

  return (
    <div className="top-rated-page">
      {firstMovie && (
        <Hero
          mode="featured"
          featuredMovieId={firstMovie.id}
        />
      )}

      <main className="top-rated-main">
        {movies.length > 0 ? (
          <section className="top-rated-section">
            <div className="section-header">
              <h2>🏆 Melhores da História</h2>
              <p>Os filmes com a maior nota média e aclamação do público através dos anos.</p>
            </div>

            <div className="movie-grid">
              {restOfMovies.map(movie => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  voteAverage={movie.vote_average}
                  releaseDate={movie.release_date}
                />
              ))}
            </div>

            {page < totalPages && (
              <div className="load-more-container">
                <button
                  className="load-more-btn"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Carregando...' : 'Carregar Mais Filmes'}
                </button>
              </div>
            )}
          </section>
        ) : (
          !loading && (
            <div className="no-movies-message">
              <h2>Nenhum filme encontrado...</h2>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default TopRated;
