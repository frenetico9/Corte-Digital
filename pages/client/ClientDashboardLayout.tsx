import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NAVALHA_SVG_ICON } from '../../constants';
import Button from '../../components/Button';

const ClientSidebarLink: React.FC<{ to: string; children: React.ReactNode; iconName: string }> = ({ to, children, iconName }) => (
  <NavLink
    to={to}
    end // Ensures exact match for index-like routes if needed
    className={({ isActive }) =>
      `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ease-in-out text-sm font-medium group
       ${isActive 
          ? 'bg-primary-blue text-white shadow-md' 
          : 'text-text-dark hover:bg-light-blue hover:text-primary-blue'
       }`
    }
  >
    <span className="material-icons-outlined text-xl group-hover:text-primary-blue transition-colors">
      {iconName}
    </span>
    <span>{children}</span>
  </NavLink>
);

const ClientDashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-white shadow-lg p-4 space-y-2 flex flex-col h-screen sticky top-0">
        <Link to="/" className="flex items-center space-x-2 mb-6 p-2 border-b border-light-blue group">
          <span className="text-primary-blue w-10 h-10 group-hover:opacity-80 transition-opacity" dangerouslySetInnerHTML={{ __html: NAVALHA_SVG_ICON }} />
          <div>
            <h2 className="text-lg font-bold text-primary-blue group-hover:opacity-80 transition-opacity leading-tight">Cliente</h2>
            {user && <p className="text-xs text-text-light truncate max-w-[120px]">{user.name || user.email}</p>}
          </div>
        </Link>
        <nav className="space-y-1.5 flex-grow">
          <ClientSidebarLink to="/client/appointments" iconName="event_note">Meus Agendamentos</ClientSidebarLink>
          <ClientSidebarLink to="/client/profile" iconName="person">Meu Perfil</ClientSidebarLink>
          <ClientSidebarLink to="/client/find-barbershops" iconName="search">Encontrar Barbearias</ClientSidebarLink> {/* Updated Link */}
        </nav>
        <div className="mt-auto pt-4 border-t border-light-blue">
           <Button onClick={handleLogout} variant="outline" fullWidth size="sm">
            <span className="material-icons-outlined text-sm mr-1">logout</span>Sair
           </Button>
        </div>
      </aside>
      <main className="flex-grow p-6 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientDashboardLayout;