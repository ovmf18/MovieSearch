import { useState, useEffect } from 'react';
import { movieService } from '../services/api';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import './Upcoming.scss';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

const Upcoming = () => {
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUpcoming = async (currentPage: number) => {
    try {
      currentPage === 1 ? setLoading(true) : setLoadingMore(true);

      const response = await movieService.getUpcoming(currentPage);
      const newMovies = response.results;
      setTotalPages(response.total_pages);

      const today = new Date();
      // Remover a restrição de 90 dias já que você estava curioso sobre as próximas páginas,
      // ou podemos manter os 90 dias focando só no que tá logo aí.
      // Vou manter sem o limite de 90 dias agora para garantir que as páginas sempre tragam mais coisas.
      // E remover filmes antigos
      const filtered = newMovies.filter((movie: Movie) => {
        const releaseDate = new Date(movie.release_date);
        return releaseDate >= today;
      });

      setUpcomingMovies(prev => {
        // Ordenar apenas a nova leva (para que a lista já carregada não embaralhe)
        const sortedNewMovies = filtered.sort((a: Movie, b: Movie) =>
          new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
        );

        const combined = currentPage === 1 ? sortedNewMovies : [...prev, ...sortedNewMovies];

        // Remover duplicatas
        return combined.filter((movie: Movie, index: number, self: Movie[]) =>
          index === self.findIndex((m) => m.id === movie.id)
        );
      });

    } catch (error) {
      console.error("Erro ao buscar lançamentos:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUpcoming(1);
    document.title = "Próximos Lançamentos | MovieSearch";
    window.scrollTo(0, 0);
  }, []);

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUpcoming(nextPage);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="upcoming-page">
        <div className="hero-skeleton shimmer"></div>
        <main className="upcoming-main">
          <section className="upcoming-section">
            <div className="section-header">
              <h2>📅 Próximas Estreias</h2>
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

  const otherMovies = upcomingMovies.slice(1);

  return (
    <div className="upcoming-page">
      {upcomingMovies.length > 0 && (
        <Hero
          mode="featured"
          featuredMovieId={upcomingMovies[0].id}
        />
      )}

      <main className="upcoming-main">
        {otherMovies.length > 0 ? (
          <section className="upcoming-section">
            <div className="section-header">
              <h2>📅 Próximas Estreias</h2>
            </div>

            <div className="movie-grid">
              {otherMovies.map(movie => (
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
            <div className="coming-soon-message">
              <h2>Nenhum lançamento próximo...</h2>
              <p>Fique de olho nesta página para as estreias mais aguardadas do cinema.</p>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default Upcoming;
