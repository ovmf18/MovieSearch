import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import './Navbar.scss';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <Clapperboard color="#00df82" size={32} />
          <h1>Movie<span>Search</span></h1>
        </Link>

        <ul className="nav-links">
          <li><a href="#">Em Alta</a></li>
          <li><a href="#">Lançamentos</a></li>
          <li><a href="#">Melhores da História</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
