

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { NAVALHA_LOGO_URL } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { BarbershopProfile, Service as ServiceType, SubscriptionPlanTier } from '../types';
import { mockGetPublicBarbershops, mockGetServicesForBarbershop, mockGetBarbershopSubscription } from '../services/mockApiService';
import LoadingSpinner from '../components/LoadingSpinner';

const FeatureCard: React.FC<{ title: string; description: string; iconName: string }> = ({ title, description, iconName }) => (
  <div className="bg-light-blue p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
    <div className="flex items-center justify-center w-12 h-12 bg-primary-blue text-white rounded-full mb-4 mx-auto">
      <span className="material-icons-outlined text-2xl">{iconName}</span>
    </div>
    <h3 className="text-xl font-semibold text-primary-blue mb-2 text-center">{title}</h3>
    <p className="text-gray-700 text-sm text-center">{description}</p>
  </div>
);

const ProBadge = () => (
    <div className="absolute top-4 right-4 bg-gradient-to-br from-amber-400 to-yellow-500 text-white px-2 py-1 rounded-full shadow-lg flex items-center text-xs font-bold z-10">
      <span className="material-icons-outlined text-sm mr-1" style={{ color: 'white' }}>star</span>
      PRO
    </div>
  );

const BarbershopShowcaseCard: React.FC<{ barbershop: BarbershopProfile & { subscriptionTier: SubscriptionPlanTier }, services: ServiceType[] }> = ({ barbershop, services }) => {
    const isPro = barbershop.subscriptionTier === SubscriptionPlanTier.PRO;
    return (
        <div className={`relative bg-white p-6 rounded-xl shadow-2xl border transform hover:scale-105 transition-transform duration-300 ease-out flex flex-col justify-between
            ${isPro ? 'border-amber-400 shadow-[0_0_20px_rgba(255,215,0,0.7)]' : 'border-primary-blue/30'}
        `}>
            {isPro && <ProBadge />}
            <div>
            {barbershop.logoUrl ? 
                <img src={barbershop.logoUrl} alt={`${barbershop.name} logo`} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-light-blue shadow-md" /> 
                : <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-primary-blue text-4xl font-bold border-4 border-light-blue shadow-md">{barbershop.name.charAt(0)}</div>
            }
            <h3 className="text-2xl font-bold text-primary-blue text-center mb-2">{barbershop.name}</h3>
            <p className="text-gray-600 text-center text-xs mb-1 truncate" title={barbershop.address}>{barbershop.address}</p>
            <p className="text-gray-600 text-center text-xs mb-4">Telefone: {barbershop.phone}</p>
            
            {services.length > 0 && (
                <div className="mb-4">
                <h4 className="text-xs font-semibold text-primary-blue mb-1 text-center">Principais Serviços:</h4>
                {services.slice(0, 2).map(service => (
                    <div key={service.id} className="text-xs text-gray-700 p-1.5 bg-light-blue/70 rounded mb-1 text-center truncate">
                        {service.name} - R$ {service.price.toFixed(2).replace('.',',')}
                    </div>
                ))}
                {services.length > 2 && <p className="text-xs text-primary-blue text-center mt-1">e mais!</p>}
                </div>
            )}
            </div>

            <Link to={`/barbershop/${barbershop.id}`} className="mt-auto">
            <Button variant="primary" fullWidth>Ver Barbearia e Agendar</Button>
            </Link>
        </div>
    );
};


const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [publicBarbershops, setPublicBarbershops] = useState<(BarbershopProfile & {subscriptionTier: SubscriptionPlanTier})[]>([]);
  const [barbershopServices, setBarbershopServices] = useState<Record<string, ServiceType[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const shops = await mockGetPublicBarbershops(3); 
        
        const detailedShopsPromises = shops.map(async (shop) => {
            const subscription = await mockGetBarbershopSubscription(shop.id);
            return {
                ...shop,
                subscriptionTier: subscription?.planId ?? SubscriptionPlanTier.FREE,
            };
        });
        let detailedShops = await Promise.all(detailedShopsPromises);
        
        // Sort to put PRO shops first
        detailedShops.sort((a, b) => {
            const aIsPro = a.subscriptionTier === SubscriptionPlanTier.PRO;
            const bIsPro = b.subscriptionTier === SubscriptionPlanTier.PRO;
            if (aIsPro && !bIsPro) return -1;
            if (!aIsPro && bIsPro) return 1;
            return 0;
        });

        setPublicBarbershops(detailedShops);

        if (shops.length > 0) {
            const servicesPromises = shops.map(shop => mockGetServicesForBarbershop(shop.id));
            const servicesResults = await Promise.all(servicesPromises);
            
            const servicesMap: Record<string, ServiceType[]> = {};
            shops.forEach((shop, index) => {
                servicesMap[shop.id] = servicesResults[index].filter(s => s.isActive);
            });
            setBarbershopServices(servicesMap);
        }

      } catch (error) {
        console.error("Error fetching public barbershops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="text-text-dark space-y-16 md:space-y-24">
      {/* Hero Section */}
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
             <Link to={user.type === 'client' ? "/client/find-barbershops" : "/admin/overview"}>
                <Button size="lg" className="bg-white text-primary-blue hover:bg-light-blue shadow-xl hover:shadow-2xl transform hover:scale-105">
                    {user.type === 'client' ? "Encontrar Barbearias" : "Acessar Painel"}
                </Button>
              </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
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
            iconName="star"
            title="Destaque-se com PRO"
            description="Assine o plano PRO para aparecer no topo das buscas e atrair mais clientes para sua barbearia."
          />
        </div>
      </section>

      {/* Barbershops Showcase */}
      {!user?.id && ( 
        <section className="py-12 bg-gray-50 rounded-lg">
          <h2 className="text-3xl font-bold text-primary-blue text-center mb-12">Encontre Barbearias Incríveis</h2>
          {loading ? <LoadingSpinner label="Carregando barbearias..." /> : (
            publicBarbershops.length > 0 ? (
              <div className="container mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicBarbershops.map(shop => (
                  <BarbershopShowcaseCard key={shop.id} barbershop={shop} services={barbershopServices[shop.id] || []} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 bg-white p-6 rounded-lg shadow-md">Nenhuma barbearia para exibir no momento. <Link to="/signup/barbershop" className="text-primary-blue hover:underline font-semibold">Cadastre a sua!</Link></p>
            )
          )}
        </section>
      )}

      {/* Call to Action for Barbershops */}
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