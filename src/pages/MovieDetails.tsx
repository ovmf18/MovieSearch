import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Star, Play, ImageOff, X, Bookmark, ArrowRight } from 'lucide-react';
import { movieService } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import SkeletonMovieDetails from '../components/SkeletonMovieDetails';
import './MovieDetails.scss';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  tagline: string;
  original_title: string;
  original_language: string;
  budget: number;
  revenue: number;

  vote_average: number;
  genres: { id: number; name: string }[];
  release_dates: {
    results: {
      iso_3166_1: string;
      release_dates: { release_date: string; type: number; certification: string }[];
    }[];
  };
  credits: {
    cast: { id: number; name: string; character: string; profile_path: string }[];
    crew: { id: number; name: string; job: string }[];
  };
  videos?: {
    results: { id: string; key: string; name: string; site: string; type: string }[];
  };
  "watch/providers"?: {
    results: {
      [key: string]: {
        link: string;
        flatrate?: { logo_path: string; provider_id: number; provider_name: string }[];
        buy?: { logo_path: string; provider_id: number; provider_name: string }[];
        rent?: { logo_path: string; provider_id: number; provider_name: string }[];
      };
    };
  };
  images?: {
    logos: { file_path: string }[];
  };
}

interface RecommendedMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [recommendedMovies, setRecommendedMovies] = useState<RecommendedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const movieId = id ? parseInt(id, 10) : 0;
  const isBookmarked = isInWatchlist(movieId);

  const toggleWatchlist = () => {
    if (!movie) return;
    if (isBookmarked) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average
      });
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await movieService.getMovieDetails(id);
        const recommendationData = await movieService.getRecommendations(id);
        setMovie(data);
        document.title = `${data.title} | MovieSearch`;
        setRecommendedMovies(recommendationData.results.slice(0, 5));
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <SkeletonMovieDetails />;
  if (!movie) return <div className="error-screen">Filme não encontrado.</div>;

  const formatBRDate = (dateStr: string) => {
    if (!dateStr || isNaN(Date.parse(dateStr))) return 'Data indisponível';
    const [year, month, day] = dateStr.slice(0, 10).split('-').map(Number);
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  const brRelease = movie.release_dates.results.find(r => r.iso_3166_1 === 'BR');

  const brTheatrical = brRelease?.release_dates.find(rd => rd.type === 3) || brRelease?.release_dates[0];

  const certification = brRelease?.release_dates.find(rd => rd.certification !== '')?.certification || '?';
  const rawDate = brTheatrical?.release_date || movie.release_date;
  const brDate = formatBRDate(rawDate);


  const directors = movie.credits.crew.filter(person => person.job === 'Director');
  const writers = movie.credits.crew.filter(person => person.job === 'Screenplay' || person.job === 'Writer');

  const trailer = movie.videos?.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer') ||
    movie.videos?.results.find(vid => vid.site === 'YouTube' && vid.type === 'Teaser');

  const backgroundUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null;
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;

  const watchProviders = movie['watch/providers']?.results['BR'];
  const streamingProviders = watchProviders?.flatrate || [];

  const rentOrBuyProviders = [...(watchProviders?.rent || []), ...(watchProviders?.buy || [])]
    .filter((v, i, a) => a.findIndex(t => (t.provider_id === v.provider_id)) === i);

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    if (!amount || amount === 0) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatLanguage = (lang: string) => {
    try {
      const languageNames = new Intl.DisplayNames(['pt-BR'], { type: 'language' });
      const name = languageNames.of(lang);
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : lang;
    } catch {
      return lang.toUpperCase();
    }
  };

  return (
    <div className="movie-details-page">
      <div
        className="backdrop-container"
        style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : { backgroundColor: '#0f1014' }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      <div className="details-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} /> Voltar
        </button>

        <div className="main-info">
          <div className="poster-side">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} className="detail-poster" />
            ) : (
              <div className="detail-poster missing">
                <ImageOff size={80} />
                <span>Pôster indisponível</span>
              </div>
            )}

            {(streamingProviders.length > 0 || rentOrBuyProviders.length > 0) && (
              <div className="watch-providers-section">
                <h3>Onde Assistir</h3>
                <div className="providers-container">
                  {streamingProviders.length > 0 && (
                    <div className="provider-group">
                      <span>Streaming</span>
                      <div className="provider-list">
                        {streamingProviders.map(provider => (
                          <img
                            key={provider.provider_id}
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            title={provider.provider_name}
                            className="provider-logo"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {rentOrBuyProviders.length > 0 && (
                    <div className="provider-group">
                      <span>Alugar / Comprar</span>
                      <div className="provider-list">
                        {rentOrBuyProviders.map(provider => (
                          <img
                            key={`rent-buy-${provider.provider_id}`}
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            title={provider.provider_name}
                            className="provider-logo"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="side-info-section">
              <h3>Informações</h3>
              <div className="info-list">
                <div className="info-item-block">
                  <span className="info-label">Título Original</span>
                  <span className="info-value">{movie.original_title}</span>
                </div>
                <div className="info-item-block">
                  <span className="info-label">Idioma Original</span>
                  <span className="info-value">{formatLanguage(movie.original_language)}</span>
                </div>
                <div className="info-item-block">
                  <span className="info-label">Orçamento</span>
                  <span className="info-value">{formatCurrency(movie.budget)}</span>
                </div>
                <div className="info-item-block">
                  <span className="info-label">Bilheteria</span>
                  <span className="info-value">{formatCurrency(movie.revenue)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="content-side">
            <h1 className="movie-title">
              {movie.title} <span>({movie.release_date.split('-')[0]})</span>
            </h1>

            {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}

            <div className="meta-info">
              <span className={`certification ${certification === '?' ? 'cert-unknown' : `cert-${certification.toLowerCase()}`}`}>
                {certification}
              </span>
              <span className="info-item"><Calendar size={18} /> {brDate} (BR)</span>
              <span className="dot">•</span>
              <span className="info-item">
                {movie.genres.map(g => g.name).join(', ')}
              </span>
              <span className="dot">•</span>
              <span className="info-item"><Clock size={18} /> {formatRuntime(movie.runtime)}</span>
            </div>

            <div className="rating-section">
              <div className={`score-badge ${(() => {
                const r = movie.vote_average;
                if (r === 0) return 'none';
                if (r >= 7) return 'high';
                if (r >= 4) return 'mid';
                return 'low';
              })()}`}>
                <Star size={20} fill="currentColor" />
                {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'N/A'}
              </div>
              <span className="vote-label">Avaliação dos Usuários</span>

              <button 
                className={`watchlist-main-btn ${isBookmarked ? 'active' : ''}`}
                onClick={toggleWatchlist}
              >
                <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                {isBookmarked ? "Remover da Lista" : "Adicionar à Lista"}
              </button>

              {trailer && (
                <button className="trailer-btn" onClick={() => setShowTrailer(true)}>
                  <Play size={20} fill="currentColor" /> Assista ao Trailer
                </button>
              )}
            </div>

            <div className="overview-section">
              <h3>Sinopse</h3>
              <p>{movie.overview || "Nenhuma sinopse disponível."}</p>
            </div>

            <div className="crew-info">
              {directors.length > 0 && (
                <div className="crew-item">
                  <strong>Direção</strong>
                  <p>
                    {directors.map((d, index) => (
                      <span key={`dir-${d.id}`}>
                        <Link to={`/person/${d.id}`} className="crew-link">{d.name}</Link>
                        {index < directors.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                </div>
              )}
              {writers.length > 0 && (
                <div className="crew-item">
                  <strong>Roteiro</strong>
                  <p>
                    {writers.map((w, index) => (
                      <span key={`writ-${w.id}`}>
                        <Link to={`/person/${w.id}`} className="crew-link">{w.name}</Link>
                        {index < writers.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>

            <div className="cast-section">
              <h3>Elenco Principal</h3>
              <div className="cast-list">
                {movie.credits.cast.slice(0, 6).map(person => (
                  <Link to={`/person/${person.id}`} key={person.id} className="cast-card">
                    <div className="cast-img-wrapper">
                      {person.profile_path ? (
                        <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name} />
                      ) : (
                        <div className="no-img">?</div>
                      )}
                    </div>
                    <p className="actor-name">{person.name}</p>
                    <p className="char-name">{person.character}</p>
                  </Link>
                ))}
                {movie.credits.cast.length > 6 && (
                  <Link to={`/movie/${movie.id}/credits`} className="show-more-link">
                    Mostrar mais <ArrowRight size={20} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {recommendedMovies.length > 0 && (
        <div className="similar-movies-section">
          <h2>Recomendações de Filmes <span>semelhantes a {movie.title}</span></h2>
          <div className="list-wrapper">
            <div className="horizontal-list">
              {recommendedMovies.map(rec => (
                <MovieCard
                  key={`rec-${rec.id}`}
                  id={rec.id}
                  title={rec.title}
                  posterPath={rec.poster_path}
                  releaseDate={rec.release_date}
                  voteAverage={rec.vote_average}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showTrailer && trailer && (
        <div className="trailer-modal">
          <div className="modal-overlay" onClick={() => setShowTrailer(false)}></div>
          <div className="modal-content">
            <h2 className="modal-title">Trailer</h2>
            <button className="close-modal" onClick={() => setShowTrailer(false)}>
              <X size={24} />
            </button>
            <div className="video-container">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`}
                title="Trailer do Filme"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
