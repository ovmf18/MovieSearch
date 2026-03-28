import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ImageOff, Calendar, MapPin } from 'lucide-react';
import { movieService } from '../services/api';
import MovieCard from '../components/MovieCard';
import SkeletonPersonDetails from '../components/SkeletonPersonDetails';
import './PersonDetails.scss';

interface PersonDetailsData {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
}

interface MovieCredit {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  popularity: number;
  character?: string;
  job?: string;
}

const PersonDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<PersonDetailsData | null>(null);
  const [movies, setMovies] = useState<MovieCredit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [personData, creditsData] = await Promise.all([
          movieService.getPersonDetails(id),
          movieService.getPersonMovieCredits(id)
        ]);

        setPerson(personData);
        document.title = `${personData.name} | MovieSearch`;
        const allCredits = [...(creditsData.cast || []), ...(creditsData.crew || [])];
        
        // Remove duplicates and aggregate jobs if any
        const uniqueCreditsMap = new Map();
        allCredits.forEach((item: any) => {
          if (!uniqueCreditsMap.has(item.id)) {
            uniqueCreditsMap.set(item.id, { ...item });
          } else {
             const existing = uniqueCreditsMap.get(item.id);
             if (item.job && existing.job && !existing.job.includes(item.job)) {
               existing.job += `, ${item.job}`;
             } else if (item.job && !existing.job) {
               existing.job = item.job;
             }
          }
        });

        // Sort movies by popularity
        const sortedMovies = Array.from(uniqueCreditsMap.values())
          .filter((m: any) => m.poster_path)
          .sort((a: any, b: any) => b.popularity - a.popularity)
          .slice(0, 20);

        setMovies(sortedMovies);
      } catch (error) {
        console.error("Erro ao buscar detalhes da pessoa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <SkeletonPersonDetails />;

  if (!person) return <div className="error-screen">Identidade não encontrada.</div>;

  const profileUrl = person.profile_path ? `https://image.tmdb.org/t/p/h632${person.profile_path}` : null;
  
  const formatBRDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const translateDepartment = (dept: string) => {
    const map: Record<string, string> = {
      'Acting': 'Atuação',
      'Directing': 'Direção',
      'Writing': 'Roteiro',
      'Production': 'Produção',
      'Editing': 'Edição',
      'Art': 'Arte',
      'Sound': 'Som',
      'Camera': 'Câmera',
      'Costume & Make-Up': 'Figurinos e Maquiagem',
      'Lighting': 'Iluminação',
      'Visual Effects': 'Efeitos Visuais',
      'Creator': 'Criação',
      'Crew': 'Equipe',
    };
    return map[dept] || dept;
  };

  const translateJob = (jobStr: string) => {
    const map: Record<string, string> = {
      'Director': 'Direção',
      'Screenplay': 'Roteirista',
      'Writer': 'Roteirista',
      'Author': 'Autor',
      'Story': 'História Original',
      'Producer': 'Produção',
      'Executive Producer': 'Produção Executiva',
      'Editor': 'Edição',
      'Original Music Composer': 'Trilha Sonora',
      'Director of Photography': 'Cinematografia',
    };
    return jobStr.split(', ').map(j => map[j] || j).join(', ');
  };

  return (
    <div className="person-details-page">
      <div className="person-backdrop"></div>
      
      <div className="person-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} /> Voltar
        </button>

        <div className="main-info">
          <div className="profile-side">
            {profileUrl ? (
              <img src={profileUrl} alt={person.name} className="profile-poster" />
            ) : (
              <div className="profile-poster missing">
                <ImageOff size={80} />
                <span>Foto indisponível</span>
              </div>
            )}
            
            <div className="personal-info">
              <h3>Informações Pessoais</h3>
              <div className="info-block">
                <span className="label">Conhecido(a) por</span>
                <span className="value">{translateDepartment(person.known_for_department)}</span>
              </div>
              
              {person.birthday && (
                <div className="info-block">
                  <span className="label"><Calendar size={16}/> Nascimento</span>
                  <span className="value">
                    {formatBRDate(person.birthday)} 
                    {!person.deathday && ` (${new Date().getFullYear() - new Date(person.birthday).getFullYear()} anos)`}
                  </span>
                </div>
              )}
              
              {person.deathday && (
                <div className="info-block">
                  <span className="label"><Calendar size={16}/> Falecimento</span>
                  <span className="value">{formatBRDate(person.deathday)}</span>
                </div>
              )}
              
              {person.place_of_birth && (
                <div className="info-block">
                  <span className="label"><MapPin size={16}/> Local de Nascimento</span>
                  <span className="value">{person.place_of_birth}</span>
                </div>
              )}
            </div>
          </div>

          <div className="content-side">
            <h1 className="person-name">{person.name}</h1>
            
            <div className="biography-section">
              <h3 className="section-title">Biografia</h3>
              <div className="bio-content">
                {person.biography ? (
                  person.biography.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p className="no-bio">Não há biografia disponível para {person.name} em português.</p>
                )}
              </div>
            </div>

            <div className="known-for-section">
              <h3 className="section-title">Conhecido(a) por</h3>
              {movies.length > 0 ? (
                <div className="movie-grid">
                  {movies.map(movie => (
                    <div key={`credit-${movie.id}`} className="movie-credit-card">
                      <MovieCard
                        id={movie.id}
                        title={movie.title}
                        posterPath={movie.poster_path}
                        voteAverage={movie.vote_average}
                        releaseDate={movie.release_date}
                      />
                      <p className="character-name">
                        {movie.character ? (
                          <>Papel: <span>{movie.character}</span></>
                        ) : movie.job ? (
                          <>Equipe: <span>{translateJob(movie.job)}</span></>
                        ) : (
                          <>Papel: <span>Desconhecido</span></>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhum filme de destaque encontrado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;
