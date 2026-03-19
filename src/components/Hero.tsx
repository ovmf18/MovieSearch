import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, ImageOff } from 'lucide-react';
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
  backdropPath?: string;
  featuredMovieId?: number;
  mode?: 'search' | 'featured';
}

const Hero = ({ backdropPath, featuredMovieId, mode = 'search' }: HeroProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === 'featured' && featuredMovieId) {
      movieService.getMovieDetails(featuredMovieId).then((data) => {
        setFeaturedMovie(data);
      });
    }
  }, [mode, featuredMovieId]);

  const backgroundUrl = mode === 'featured' && featuredMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`
    : backdropPath 
      ? `https://image.tmdb.org/t/p/original${backdropPath}`
      : '';

  const logoUrl = featuredMovie?.images?.logos?.find((l: any) => l.iso_639_1 === 'en' || l.iso_639_1 === 'pt')?.file_path 
    ? `https://image.tmdb.org/t/p/w500${featuredMovie.images.logos.find((l: any) => l.iso_639_1 === 'en' || l.iso_639_1 === 'pt').file_path}` 
    : null;

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <section 
      className={`hero ${mode === 'featured' ? 'featured' : ''}`} 
      style={{ backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none' }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          {mode === 'featured' && featuredMovie ? (
            <div className="featured-info">
              {logoUrl ? (
                <img src={logoUrl} alt={featuredMovie.title} className="featured-logo" />
              ) : (
                <h2 className="featured-title">{featuredMovie.title}</h2>
              )}
              <p className="featured-overview">
                {featuredMovie.overview?.length > 180 
                  ? featuredMovie.overview.substring(0, 180) + '...' 
                  : featuredMovie.overview || "Nenhuma sinopse disponível."}
              </p>
              <div className="featured-actions">
                <Link to={`/movie/${featuredMovie.id}`} className="btn-details">
                  Mais Informações
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2>Onde o cinema ganha vida.</h2>
              <h3>Sua próxima história favorita está a uma busca de distância. O que vamos assistir hoje?</h3>
            </>
          )}

          {mode === 'search' && (
            <div className="search-container-hero">
              <form className="search-box" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Buscar por um Filme..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 2 && setShowDropdown(true)}
                />
                <button type="submit">Pesquisar</button>
              </form>

              {showDropdown && results.length > 0 && (
                <div className="search-dropdown" ref={searchRef}>
                  {results.map((movie) => (
                    <Link
                      key={movie.id}
                      to={`/movie/${movie.id}`}
                      className="dropdown-item"
                      onClick={() => {
                        setShowDropdown(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="item-poster">
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                            alt={movie.title}
                          />
                        ) : (
                          <div className="no-img-small">
                            <ImageOff size={20} />
                          </div>
                        )}
                      </div>
                      <div className="item-info">
                        <p className="item-title">{movie.title}</p>
                        <div className="item-meta">
                          <span>
                            {movie.release_date
                              ? movie.release_date.split('-')[0]
                              : 'N/A'}
                          </span>
                          <div className="item-rating">
                            <Star size={14} fill="currentColor" />
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
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
