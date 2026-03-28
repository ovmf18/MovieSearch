import { Link } from 'react-router-dom';
import { Film, Github, Mail, Linkedin } from 'lucide-react';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-column branding">
          <Link to="/" className="footer-logo">
            <Film size={32} color="#00df82" />
            <span>MovieSearch</span>
          </Link>
          <p className="footer-desc">
            Sua porta de entrada para o universo cinematográfico.
            Explore, descubra e organize suas histórias favoritas em um só lugar.
          </p>
          <div className="social-links">
            <a href="https://github.com/ovmf18" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
            <a href="https://www.linkedin.com/in/osmar-valporto-moreno-filho-408b72203/" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
            <a href="mailto:osmarfilho2013@gmail.com"><Mail size={20} /></a>
          </div>
        </div>

        <div className="footer-column links">
          <h3>Navegação</h3>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/trending">Em Alta</Link></li>
            <li><Link to="/upcoming">Próximos Lançamentos</Link></li>
            <li><Link to="/top-rated">Melhores Avaliados</Link></li>
            <li><Link to="/watchlist">Minha Lista</Link></li>
          </ul>
        </div>

        <div className="footer-column tmdb-credit">
          <h3>API e Dados</h3>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="tmdb-info">
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB Logo"
              className="tmdb-logo"
            />
            <p>
              Este produto usa a API TMDB, mas não é endossado ou certificado pelo TMDB. Todas as informações e imagens são fornecidas pelo TMDB.
            </p>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} MovieSearch. Por Osmar Valporto Moreno Filho.</p>
        <div className="made-with">
          <span>Desenvolvido com React</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
