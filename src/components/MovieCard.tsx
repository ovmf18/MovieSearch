import './MovieCard.scss';

interface MovieCardProps {
  title: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
}

const MovieCard = ({ title, posterPath, releaseDate, voteAverage }: MovieCardProps) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
  
  // Formatar a data para o padrão brasileiro
  const formattedDate = new Date(releaseDate).toLocaleDateString('pt-BR');

  return (
    <div className="movie-card">
      <div className="poster-wrapper">
        <img src={imageUrl} alt={title} />
        <div className="rating-badge">
          {voteAverage.toFixed(1)}
        </div>
        <div className="overlay">
          <button className="view-details">Ver Detalhes</button>
        </div>
      </div>
      <div className="movie-info">
        <h3 title={title}>{title}</h3>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default MovieCard;
