import { Link } from 'react-router-dom';
import './MovieCard.scss';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
}

const MovieCard = ({ id, title, posterPath, releaseDate, voteAverage }: MovieCardProps) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
  
  // Formatar a data para o padrão brasileiro
  const formattedDate = new Date(releaseDate).toLocaleDateString('pt-BR');

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
        <img src={imageUrl} alt={title} />
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
