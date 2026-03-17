import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, Search as SearchIcon, ImageOff } from 'lucide-react';
import { movieService } from '../services/api';
import './Hero.scss';

interface MovieResult {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface HeroProps {
  backdropPath: string;
}

const Hero = ({ backdropPath }: HeroProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const backgroundUrl = `https://image.tmdb.org/t/p/original${backdropPath}`;

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        const data = await movieService.searchMovies(searchQuery);
        setResults(data.slice(0, 5));
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="hero" style={{ backgroundImage: `url(${backgroundUrl})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h2>Onde o cinema ganha vida.</h2>
          <h3>Sua próxima história favorita está a uma busca de distância. O que vamos assistir hoje?</h3>

          <div className="search-container-hero">
            <form className="search-box" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar por um Filme, Série ou Pessoa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onFocus={() => searchQuery.length > 2 && setShowDropdown(true)}
              />
              <button type="submit">Buscar</button>
            </form>

            {/* Dropdown de Sugestões */}
            {showDropdown && results.length > 0 && (
              <div className="search-dropdown">
                {results.map(movie => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="item-poster">
                      {movie.poster_path ? (
                        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} />
                      ) : (
                        <div className="no-img-small">
                          <ImageOff size={20} />
                        </div>
                      )}
                    </div>
                    <div className="item-info">
                      <p className="item-title">{movie.title}</p>
                      <div className="item-meta">
                        <span className="item-year">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        </span>
                        <div className="item-rating">
                          <Star size={12} fill="#00df82" color="#00df82" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                <div className="dropdown-footer" onClick={handleSearch}>
                  Ver todos os resultados para "{searchQuery}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
