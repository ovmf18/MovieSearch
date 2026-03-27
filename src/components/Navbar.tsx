import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Clapperboard, Search, Star, ImageOff, X, Menu, Bookmark } from 'lucide-react';
import { movieService } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import './Navbar.scss';

interface MovieResult {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const { watchlist } = useWatchlist();

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
        setIsSearchOpen(false);
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-left">
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <Link to="/" className="logo" onClick={closeMenus}>
            <Clapperboard color="#00df82" size={32} />
            <h1>Movie<span>Search</span></h1>
          </Link>
        </div>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><NavLink to="/trending" onClick={closeMenus}>Em Alta</NavLink></li>
          <li><NavLink to="/upcoming" onClick={closeMenus}>Lançamentos</NavLink></li>
          <li><NavLink to="/top-rated" onClick={closeMenus}>Melhores da História</NavLink></li>
          <li className="watchlist-nav-item">
            <NavLink to="/watchlist" onClick={closeMenus} className="watchlist-link">
              <Bookmark size={20} />
              <span>Minha Lista</span>
              {watchlist.length > 0 && <span className="watchlist-badge">{watchlist.length}</span>}
            </NavLink>
          </li>
        </ul>

        <div className="nav-actions" ref={searchRef}>
          <div className={`nav-search-container ${isSearchOpen ? 'open' : ''}`}>
            {!isSearchOpen ? (
              <button
                className="search-icon-btn"
                onClick={() => { setIsSearchOpen(true); setIsMenuOpen(false); }}
              >
                <Search size={24} color="#ffffff" />
              </button>
            ) : (
              <form className="nav-search-box" onSubmit={handleSearch}>
                <Search size={20} color="#666" className="input-icon" />
                <input
                  type="text"
                  placeholder="Buscar Filme, Série..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 2 && setShowDropdown(true)}
                  autoFocus
                />
                <button type="button" className="close-btn" onClick={() => { setIsSearchOpen(false); setShowDropdown(false); setSearchQuery(''); }}>
                  <X size={20} color="#666" />
                </button>
              </form>
            )}

            {showDropdown && results.length > 0 && isSearchOpen && (
              <div className="nav-search-dropdown">
                {results.map(movie => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="dropdown-item"
                    onClick={() => { setShowDropdown(false); setIsSearchOpen(false); setSearchQuery(''); }}
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

      {isMenuOpen && <div className="nav-overlay" onClick={closeMenus}></div>}
    </nav>
  );
};

export default Navbar;
