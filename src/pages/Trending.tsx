import { useState, useEffect } from 'react';
import { movieService } from '../services/api';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import './Trending.scss';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

const Trending = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTrending = async (currentPage: number) => {
    try {
      currentPage === 1 ? setLoading(true) : setLoadingMore(true);

      const response = await movieService.getTrending(currentPage);
      const newMovies = response.results;
      setTotalPages(response.total_pages);

      setMovies(prev => {
        const combined = currentPage === 1 ? newMovies : [...prev, ...newMovies];

        // Remover duplicatas caso o TMDB repita filmes entre as páginas
        return combined.filter((movie: Movie, index: number, self: Movie[]) =>
          index === self.findIndex((m) => m.id === movie.id)
        );
      });

    } catch (error) {
      console.error("Erro ao buscar filmes em alta:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTrending(1);
    window.scrollTo(0, 0);
  }, []);

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTrending(nextPage);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="trending-page">
        <div className="hero-skeleton shimmer"></div>
        <main className="trending-main">
          <section className="trending-section">
            <div className="section-header">
              <h2>🎬 Em Alta</h2>
              <p>Os filmes de maior sucesso e popularidade no momento.</p>
            </div>
            <div className="movie-grid">
              {Array.from({ length: 20 }).map((_, idx) => (
                <SkeletonCard key={`skeleton-${idx}`} />
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  const firstMovie = movies[0];
  const restOfMovies = movies.slice(1);

  return (
    <div className="trending-page">
      {firstMovie && (
        <Hero
          mode="featured"
          featuredMovieId={firstMovie.id}
        />
      )}

      <main className="trending-main">
        {movies.length > 0 ? (
          <section className="trending-section">
            <div className="section-header">
              <h2>🎬 Em Alta</h2>
              <p>Os filmes de maior sucesso e popularidade no momento.</p>
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
              <h2>Nenhum filme encontrado no momento...</h2>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default Trending;
