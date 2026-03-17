import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { movieService } from '../services/api'
import MovieCard from '../components/MovieCard'
import './Search.scss'

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const results = await movieService.searchMovies(query);
        setMovies(results);
      } catch (error) {
        console.error("Erro na busca:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="search-page">
      <div className="search-container">
        <header className="search-header">
          <h1>Resultados para: <span>{query}</span></h1>
          <p>Encontramos {movies.length} filmes para sua pesquisa.</p>
        </header>

        {loading ? (
          <div className="loading">Buscando o melhor do cinema...</div>
        ) : (
          <div className="search-grid">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  releaseDate={movie.release_date}
                  voteAverage={movie.vote_average}
                />
              ))
            ) : (
              <div className="no-results">
                <h2>Nenhum filme encontrado 😕</h2>
                <p>Tente buscar por outro termo ou verifique a ortografia.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
