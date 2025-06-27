// Arquivo: pages/HomePage.tsx (MODIFICADO)

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { NAVALHA_LOGO_URL } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { BarbershopProfile, Service as ServiceType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

// --- COMPONENTES INTERNOS (sem alterações) ---
const FeatureCard: React.FC<{ title: string; description: string; iconName: string }> = ({ title, description, iconName }) => (
    <div className="bg-light-blue p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
      <div className="flex items-center justify-center w-12 h-12 bg-primary-blue text-white rounded-full mb-4 mx-auto">
        <span className="material-icons-outlined text-2xl">{iconName}</span>
      </div>
      <h3 className="text-xl font-semibold text-primary-blue mb-2 text-center">{title}</h3>
      <p className="text-gray-700 text-sm text-center">{description}</p>
    </div>
);
  
const BarbershopShowcaseCard: React.FC<{ barbershop: BarbershopWithServices }> = ({ barbershop }) => (
    <div className="bg-white p-6 rounded-xl shadow-2xl border border-primary-blue/30 transform hover:scale-105 transition-transform duration-300 ease-out flex flex-col justify-between">
      <div>
        {/* Atenção: seu schema tem 'imageUrl', mas o código usava 'logoUrl'. Adaptei para 'imageUrl' */}
        {barbershop.imageUrl ? 
            <img src={barbershop.imageUrl} alt={`${barbershop.name} logo`} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-light-blue shadow-md" /> 
            : <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-primary-blue text-4xl font-bold border-4 border-light-blue shadow-md">{barbershop.name.charAt(0)}</div>
        }
        <h3 className="text-2xl font-bold text-primary-blue text-center mb-2">{barbershop.name}</h3>
        <p className="text-gray-600 text-center text-xs mb-1 truncate" title={barbershop.address}>{barbershop.address}</p>
        <p className="text-gray-600 text-center text-xs mb-4">Telefone: {barbershop.phone}</p>
        
        {barbershop.services && barbershop.services.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-primary-blue mb-1 text-center">Principais Serviços:</h4>
            {barbershop.services.map(service => (
              <div key={service.id} className="text-xs text-gray-700 p-1.5 bg-light-blue/70 rounded mb-1 text-center truncate">
                  {service.name} - R$ {Number(service.price).toFixed(2).replace('.',',')}
              </div>
            ))}
          </div>
        )}
      </div>
  
      <Link to={`/barbershop/${barbershop.id}`} className="mt-auto">
        <Button variant="primary" fullWidth>Ver Barbearia e Agendar</Button>
      </Link>
    </div>
);

// --- TIPO ATUALIZADO ---
// Criamos um novo tipo para representar a barbearia com seus serviços já incluídos
type BarbershopWithServices = BarbershopProfile & {
    services: ServiceType[];
};

// --- COMPONENTE PRINCIPAL MODIFICADO ---
const HomePage: React.FC = () => {
  const { user } = useAuth();
  // Estado simplificado: agora temos apenas uma lista de barbearias, que já contêm seus serviços
  const [showcaseShops, setShowcaseShops] = useState<BarbershopWithServices[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // UMA ÚNICA CHAMADA À API! Muito mais rápido e eficiente.
        const response = await fetch('/api/barbershops');
        if (!response.ok) {
            throw new Error('Falha ao buscar dados das barbearias.');
        }
        const data: BarbershopWithServices[] = await response.json();
        
        // Armazenamos os dados recebidos diretamente no estado.
        // Se quiser limitar a 3, pode fazer data.slice(0, 3)
        setShowcaseShops(data);

      } catch (error) {
        console.error("Error fetching from API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="text-text-dark space-y-16 md:space-y-24">
      {/* Hero Section (sem alterações) */}
      <section className="py-20 md:py-28 text-white rounded-xl shadow-2xl overflow-hidden relative bg-cover bg-center" style={{backgroundImage: "url('https://i.imgur.com/LSorq3R.png')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <img src={NAVALHA_LOGO_URL} alt="Navalha Digital Logo" className="w-56 h-56 filter drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">Navalha Digital</h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            A plataforma definitiva para agendamento em barbearias. Simples para o cliente, poderosa para o seu negócio.
          </p>
          {!user && (
            <div className="space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup/client">
                <Button size="lg" className="bg-white text-primary-blue hover:bg-light-blue shadow-xl hover:shadow-2xl transform hover:scale-105">Quero Agendar</Button>
              </Link>
              <Link to="/signup/barbershop">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-blue shadow-xl hover:shadow-2xl transform hover:scale-105">Sou uma Barbearia</Button>
              </Link>
            </div>
          )}
          {user && (
             <Link to={user.type === 'client' ? "/client/appointments" : "/admin/overview"}>
                <Button size="lg" className="bg-white text-primary-blue hover:bg-light-blue shadow-xl hover:shadow-2xl transform hover:scale-105">
                    {user.type === 'client' ? "Meus Agendamentos" : "Acessar Painel"}
                </Button>
              </Link>
          )}
        </div>
      </section>

      {/* Features Section (sem alterações) */}
      <section>
        <h2 className="text-3xl font-bold text-primary-blue text-center mb-12">Por que escolher o Navalha Digital?</h2>
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          <FeatureCard
            iconName="event_available"
            title="Agendamento Fácil"
            description="Clientes agendam em segundos, escolhendo serviço, data e horário com total conveniência, 24/7."
          />
          <FeatureCard
            iconName="dashboard_customize"
            title="Gestão Completa"
            description="Barbearias gerenciam agenda, equipe, serviços, clientes e finanças em um painel intuitivo."
          />
          <FeatureCard
            iconName="payments"
            title="Planos Flexíveis"
            description="Desde o gratuito para começar até planos premium com recursos avançados para crescer seu negócio."
          />
        </div>
      </section>

      {/* Barbershops Showcase (MODIFICADO para usar o novo estado) */}
      {!user?.id && ( 
        <section className="py-12 bg-gray-50 rounded-lg">
          <h2 className="text-3xl font-bold text-primary-blue text-center mb-12">Encontre Barbearias Incríveis</h2>
          {loading ? <LoadingSpinner label="Carregando barbearias..." /> : (
            showcaseShops.length > 0 ? (
              <div className="container mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {showcaseShops.map(shop => (
                  <BarbershopShowcaseCard key={shop.id} barbershop={shop} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 bg-white p-6 rounded-lg shadow-md">Nenhuma barbearia para exibir no momento. <Link to="/signup/barbershop" className="text-primary-blue hover:underline font-semibold">Cadastre a sua!</Link></p>
            )
          )}
        </section>
      )}

      {/* Call to Action for Barbershops (sem alterações) */}
      {!user?.id && (
         <section className="py-16 bg-primary-blue text-white rounded-xl shadow-xl text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">Pronto para modernizar sua barbearia?</h2>
            <p className="text-lg mb-8 max-w-xl mx-auto">
              Junte-se ao Navalha Digital e transforme a gestão do seu negócio. Comece grátis e veja a diferença!
            </p>
            <Link to="/signup/barbershop">
              <Button size="lg" className="bg-white text-primary-blue hover:bg-light-blue shadow-lg hover:shadow-xl transform hover:scale-105">Cadastrar Minha Barbearia</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
