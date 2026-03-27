import { Link } from 'react-router-dom';
import { ImageOff, Bookmark } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import './MovieCard.scss';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
}

const MovieCard = ({ id, title, posterPath, releaseDate, voteAverage }: MovieCardProps) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const isBookmarked = isInWatchlist(id);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to details
    if (isBookmarked) {
      removeFromWatchlist(id);
    } else {
      addToWatchlist({ id, title, poster_path: posterPath, release_date: releaseDate, vote_average: voteAverage });
    }
  };

  const imageUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;

  const formatBRDate = (dateStr: string) => {
    if (!dateStr || isNaN(Date.parse(dateStr))) return 'Data indisponível';
    const [year, month, day] = dateStr.split('-').map(Number);
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  const formattedDate = releaseDate ? formatBRDate(releaseDate) : 'Data indisponível';

  // Determinar a cor da nota
  const getColorClass = (rating: number) => {
    if (rating === 0) return 'none';
    if (rating >= 7) return 'high';
    if (rating >= 4) return 'mid';
    return 'low';
  };

  return (
    <Link to={`/movie/${id}`} className="movie-card">
      <div className="poster-wrapper">
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div className="no-image-placeholder">
            <ImageOff size={48} />
            <span>Imagem indisponível</span>
          </div>
        )}
        <button 
          className={`watchlist-btn ${isBookmarked ? 'active' : ''}`} 
          onClick={toggleWatchlist}
          title={isBookmarked ? "Remover da lista" : "Adicionar à lista"}
        >
          <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
        <div className={`rating-badge ${getColorClass(voteAverage)}`}>
          {voteAverage > 0 ? voteAverage.toFixed(1) : 'N/A'}
        </div>
        <div className="overlay">
          <button className="view-details">Ver Detalhes</button>
        </div>
      </div>
      <div className="movie-info">
        <h3 title={title}>{title}</h3>
        <span>{formattedDate}</span>
      </div>
    </Link>
  );
};

export default MovieCard;
