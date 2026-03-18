import { useState, useEffect } from 'react';
import { movieService } from '../services/api';
import Hero from '../components/Hero';
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

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const movies = await movieService.getUpcoming();
        // Ordenar por data de lançamento (mais próxima primeiro)
        const sorted = movies.sort((a: Movie, b: Movie) =>
          new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
        );
        setUpcomingMovies(sorted);
      } catch (error) {
        console.error("Erro ao buscar lançamentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  if (loading) {
    return <div className="loading">Carregando novidades...</div>;
  }

  return (
    <div className="upcoming-page">
      {upcomingMovies.length > 0 && (
        <Hero
          mode="featured"
          featuredMovieId={upcomingMovies[0].id}
        />
      )}

      <main className="upcoming-main">
        {/* Futuramente adicionaremos as listas aqui */}
        <div className="coming-soon-message">
          <h2>Mais lançamentos vindo por aí...</h2>
          <p>Fique de olho nesta página para as estreias mais aguardadas do cinema.</p>
        </div>
      </main>
    </div>
  );
};

export default Upcoming;
