import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NAVALHA_LOGO_URL } from '../constants';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
  };

  return (
    <header className="bg-primary-blue text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <img src={NAVALHA_LOGO_URL} alt="Navalha Digital Logo" className="w-12 h-12 group-hover:opacity-80 transition-opacity" />
          <h1 className="text-xl sm:text-2xl font-bold group-hover:opacity-80 transition-opacity">Navalha Digital</h1>
        </Link>
        <nav className="space-x-3 sm:space-x-4 flex items-center">
          {user ? (
            <>
              {user.type === 'client' && <Link to="/client/appointments" className="text-sm sm:text-base hover:text-light-blue transition-colors">Meus Agendamentos</Link>}
              {user.type === 'admin' && <Link to="/admin/overview" className="text-sm sm:text-base hover:text-light-blue transition-colors">Painel Admin</Link>}
              <span className="text-xs sm:text-sm hidden md:inline">Olá, {user.name || user.email}</span>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm" 
                className="border-white text-white hover:bg-white hover:text-primary-blue"
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm sm:text-base hover:text-light-blue transition-colors">Login</Link>
              <Link to="/signup/client" className="text-sm sm:text-base hover:text-light-blue transition-colors hidden sm:inline">Cadastro Cliente</Link>
              <Button 
                onClick={() => navigate('/signup/barbershop')} 
                variant="outline" 
                size="sm" 
                className="border-white text-white hover:bg-white hover:text-primary-blue"
              >
                Sou Barbearia
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;