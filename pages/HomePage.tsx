import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { NAVALHA_LOGO_URL, DETAILED_FEATURES_COMPARISON } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { BarbershopProfile, Service as ServiceType, SubscriptionPlanTier } from '../types';
import { mockGetPublicBarbershops, mockGetServicesForBarbershop, mockGetBarbershopSubscription, mockGetReviewsForBarbershop } from '../services/mockApiService';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';

// --- Sub-components for HomePage ---

const HeroSection = () => (
  <section className="relative bg-dark-bg text-white overflow-hidden">
    <div className="absolute inset-0">
      <img src="https://i.imgur.com/LSorq3R.png" alt="Barbeiro trabalhando" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/70"></div>
    </div>
    <div className="relative container mx-auto px-6 py-24 md:py-32 text-center z-10">
      <div className="flex justify-center mb-6 animate-fade-in-up">
        <img src={NAVALHA_LOGO_URL} alt="Navalha Digital Logo" className="w-48 h-48 filter drop-shadow-lg animate-subtle-float" />
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight animate-fade-in-up [animation-delay:200ms]">
        Navalha <span className="text-primary-blue">Digital</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto animate-fade-in-up [animation-delay:400ms]">
        A plataforma definitiva para agendamento em barbearias. Simples para o cliente, poderosa para o seu negócio.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up [animation-delay:600ms]">
        <Link to="/signup/client">
          <Button size="lg" variant="primary" leftIcon={<span className="material-icons-outlined">calendar_today</span>}>
            Quero Agendar
          </Button>
        </Link>
        <Link to="/signup/barbershop">
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-text-dark" leftIcon={<span className="material-icons-outlined">content_cut</span>}>
            Sou uma Barbearia
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

const FeatureListItem: React.FC<{ title: string; description: string; iconName: string; }> = ({ title, description, iconName }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 w-12 h-12 bg-light-blue text-primary-blue rounded-full flex items-center justify-center ring-8 ring-surface">
            <span className="material-icons-outlined text-2xl">{iconName}</span>
        </div>
        <div className="ml-4">
            <h4 className="text-lg font-bold text-text-dark">{title}</h4>
            <p className="mt-1 text-sm text-text-light">{description}</p>
        </div>
    </div>
);


const FeaturesSection = () => (
  <section id="features" className="py-20 bg-surface">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-text-dark">Por que escolher o <span className="text-primary-blue">Navalha Digital</span>?</h2>
        <p className="text-md text-text-light mt-2 max-w-3xl mx-auto">Uma solução completa pensada para elevar o nível da sua barbearia e simplificar a vida dos seus clientes.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="space-y-8">
            <FeatureListItem iconName="event_available" title="Agendamento Fácil 24/7" description="Seus clientes agendam online a qualquer hora, de qualquer lugar, escolhendo serviço, profissional e horário com conveniência total." />
            <FeatureListItem iconName="dashboard_customize" title="Painel de Gestão Completo" description="Administre sua agenda, equipe, serviços e finanças em um só lugar. Tenha o controle total do seu negócio na palma da sua mão." />
            <FeatureListItem iconName="notifications_active" title="Notificações Inteligentes" description="Reduza faltas com lembretes automáticos de agendamento via e-mail para seus clientes. Mantenha todos sincronizados." />
            <FeatureListItem iconName="storefront" title="Página Online Personalizável" description="Crie uma vitrine digital para sua barbearia, mostrando seus serviços, equipe e avaliações. Atraia novos clientes com uma presença online profissional." />
        </div>
        <div className="flex items-center justify-center">
            <img src="https://i.imgur.com/GzC0D9c.png" alt="Ecossistema Navalha Digital em diversos dispositivos" className="max-w-full h-auto rounded-lg animate-fade-in-up" />
        </div>
      </div>
    </div>
  </section>
);

const ProBadge: React.FC<{className?: string}> = ({className}) => (
    <div className={`absolute top-0 right-4 bg-gradient-to-br from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-b-lg shadow-lg flex items-center text-xs font-bold z-10 ${className}`}>
        <span className="material-icons-outlined text-sm mr-1">star</span>
        PRO
    </div>
);

const BarbershopShowcaseCard: React.FC<{ barbershop: BarbershopProfile & { subscriptionTier: SubscriptionPlanTier; averageRating: number; reviewCount: number } }> = ({ barbershop }) => {
    const isPro = barbershop.subscriptionTier === SubscriptionPlanTier.PRO;
    return (
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-105">
            {isPro && <ProBadge />}
            <div className="h-40 bg-cover bg-center" style={{backgroundImage: `url(${barbershop.coverImageUrl || 'https://source.unsplash.com/400x300/?barbershop'})`}}></div>
            <div className="p-5">
                <div className="flex items-center -mt-12 mb-3">
                    <img src={barbershop.logoUrl || NAVALHA_LOGO_URL} alt={`${barbershop.name} logo`} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-white"/>
                    <div className="ml-3 flex-1">
                        <h3 className="text-lg font-bold text-text-dark truncate">{barbershop.name}</h3>
                         {barbershop.reviewCount > 0 && (
                            <div className="flex items-center">
                                <StarRating value={barbershop.averageRating} isEditable={false} size={16} />
                                <span className="text-xs text-text-light ml-1.5">({barbershop.averageRating.toFixed(1)})</span>
                            </div>
                         )}
                    </div>
                </div>
                <p className="text-xs text-text-light truncate mb-4 h-8" title={barbershop.address}>{barbershop.address}</p>
                <Link to={`/barbershop/${barbershop.id}`}>
                    <Button variant="primary" fullWidth size="sm">Ver e Agendar</Button>
                </Link>
            </div>
        </div>
    );
};

const BarbershopShowcaseSection: React.FC<{isLoggedIn: boolean}> = ({ isLoggedIn }) => {
    const [publicBarbershops, setPublicBarbershops] = useState<(BarbershopProfile & { subscriptionTier: SubscriptionPlanTier; averageRating: number; reviewCount: number })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(isLoggedIn) return; // Don't show this section if user is logged in
        const fetchData = async () => {
            setLoading(true);
            try {
                const shops = await mockGetPublicBarbershops(3);
                const detailedShopsPromises = shops.map(async (shop) => {
                    const [subscription, reviews] = await Promise.all([
                        mockGetBarbershopSubscription(shop.id),
                        mockGetReviewsForBarbershop(shop.id)
                    ]);
                    const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
                    return {
                        ...shop,
                        subscriptionTier: subscription?.planId ?? SubscriptionPlanTier.FREE,
                        averageRating,
                        reviewCount: reviews.length,
                    };
                });
                let detailedShops = await Promise.all(detailedShopsPromises);
                detailedShops.sort((a, b) => {
                    if (a.subscriptionTier === SubscriptionPlanTier.PRO && b.subscriptionTier !== SubscriptionPlanTier.PRO) return -1;
                    if (a.subscriptionTier !== SubscriptionPlanTier.PRO && b.subscriptionTier === SubscriptionPlanTier.PRO) return 1;
                    return b.averageRating - a.averageRating;
                });
                setPublicBarbershops(detailedShops);
            } catch (error) {
                console.error("Error fetching public barbershops:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isLoggedIn]);

    if (isLoggedIn) return null;
  
    return (
        <section id="barbershops" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-dark">Encontre Barbearias <span className="text-primary-blue">Incríveis</span></h2>
                    <p className="text-md text-text-light mt-2">Descubra os melhores profissionais perto de você.</p>
                </div>
                {loading ? <LoadingSpinner label="Carregando barbearias..." /> : (
                    publicBarbershops.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {publicBarbershops.map(shop => (
                                <BarbershopShowcaseCard key={shop.id} barbershop={shop} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-text-light">Nenhuma barbearia para exibir no momento.</p>
                    )
                )}
                 <div className="text-center mt-12">
                    <Link to="/client/find-barbershops">
                        <Button variant="outline" size="lg">Ver Todas as Barbearias</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 ${className}`}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);
const CrossIcon: React.FC<{className?: string}> = ({className}) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 ${className}`}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
);

const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
        return value ? <CheckIcon className="text-green-500 mx-auto" /> : <CrossIcon className="text-gray-400 mx-auto" />;
    }
    return <span className="font-semibold text-text-dark">{value}</span>;
};


const PricingSection = () => {
    const categories = [...new Set(DETAILED_FEATURES_COMPARISON.map(f => f.category))];

    return (
        <section id="plans" className="py-20 bg-surface">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-dark">Compare nossos <span className="text-primary-blue">Planos</span></h2>
                    <p className="text-md text-text-light mt-2 max-w-2xl mx-auto">Escolha o plano que melhor se adapta ao seu momento e cresça conosco.</p>
                </div>
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-border-color">
                        <table className="w-full text-sm text-center">
                            <thead className="bg-white">
                                <tr>
                                    <th className="p-6 text-left text-lg font-bold text-text-dark w-1/2">Funcionalidades</th>
                                    <th className="p-6 text-lg font-bold text-text-dark border-l border-border-color">Grátis</th>
                                    <th className="p-6 text-lg font-bold text-primary-blue border-l border-border-color relative">
                                        PRO
                                        <div className="absolute -top-0 left-1/2 -translate-x-1/2 bg-primary-blue text-white text-xs font-bold px-3 py-1 rounded-b-md">RECOMENDADO</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(category => (
                                    <Fragment key={category}>
                                        <tr className="bg-surface">
                                            <td colSpan={3} className="p-3 text-left font-bold text-primary-blue">{category}</td>
                                        </tr>
                                        {DETAILED_FEATURES_COMPARISON.filter(f => f.category === category).map(featureItem => (
                                            <tr key={featureItem.feature} className="border-t border-border-color hover:bg-light-blue/50">
                                                <td className="p-4 text-left text-text-light">{featureItem.feature}</td>
                                                <td className="p-4 border-l border-border-color">{renderFeatureValue(featureItem.free)}</td>
                                                <td className="p-4 border-l border-border-color">{renderFeatureValue(featureItem.pro)}</td>
                                            </tr>
                                        ))}
                                    </Fragment>
                                ))}
                            </tbody>
                             <tfoot className="bg-white">
                                <tr className="border-t-2 border-primary-blue">
                                     <td className="p-6 text-left">
                                        <p className="font-bold text-text-dark">Invista no seu crescimento</p>
                                        <p className="text-xs text-text-light">Escolha um plano e comece a transformar seu negócio hoje.</p>
                                     </td>
                                     <td className="p-6 border-l border-border-color">
                                        <Link to="/signup/barbershop"><Button variant="outline" fullWidth>Começar Grátis</Button></Link>
                                     </td>
                                     <td className="p-6 border-l border-border-color">
                                        <Link to="/signup/barbershop"><Button variant="primary" fullWidth>Assinar PRO</Button></Link>
                                     </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};


const HowItWorksSection = () => (
    <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-dark">Como Funciona em <span className="text-primary-blue">4 Passos</span></h2>
                <p className="text-md text-text-light mt-2">Agendar seu próximo corte nunca foi tão fácil.</p>
            </div>
            <div className="grid md:grid-cols-2 items-center gap-12">
                <div className="relative">
                    <img src="https://i.imgur.com/gK7P6bQ.png" alt="Celular mostrando o app Navalha Digital" className="max-w-xs mx-auto animate-subtle-float" />
                </div>
                <div className="space-y-8">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-light-blue text-primary-blue flex items-center justify-center font-bold text-xl ring-8 ring-white">1</div>
                        <div className="ml-4">
                            <h4 className="font-bold text-text-dark">Cadastre-se ou Faça Login</h4>
                            <p className="text-sm text-text-light">Crie sua conta em segundos para salvar suas preferências e agendamentos.</p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-light-blue text-primary-blue flex items-center justify-center font-bold text-xl ring-8 ring-white">2</div>
                        <div className="ml-4">
                            <h4 className="font-bold text-text-dark">Encontre Sua Barbearia</h4>
                            <p className="text-sm text-text-light">Busque por nome, localização ou veja nossas sugestões de barbearias PRO.</p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-light-blue text-primary-blue flex items-center justify-center font-bold text-xl ring-8 ring-white">3</div>
                        <div className="ml-4">
                            <h4 className="font-bold text-text-dark">Agende o Serviço</h4>
                            <p className="text-sm text-text-light">Escolha o serviço, o profissional, a data e o horário que preferir. Tudo online.</p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-light-blue text-primary-blue flex items-center justify-center font-bold text-xl ring-8 ring-white">4</div>
                        <div className="ml-4">
                            <h4 className="font-bold text-text-dark">Compareça e Avalie</h4>
                            <p className="text-sm text-text-light">Vá até a barbearia na hora marcada e, depois, deixe sua avaliação para ajudar a comunidade.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);


const CTASection = () => (
    <section className="py-20 bg-primary-blue text-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para modernizar seu negócio?</h2>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
                Junte-se a centenas de barbearias que já estão transformando sua gestão com o Navalha Digital.
            </p>
            <Link to="/signup/barbershop">
                <Button size="lg" className="bg-white text-primary-blue hover:bg-light-blue transform hover:scale-105">Cadastrar Minha Barbearia Agora</Button>
            </Link>
        </div>
    </section>
);

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="bg-white">
      <HeroSection />
      <FeaturesSection />
      <BarbershopShowcaseSection isLoggedIn={!!user} />
      <PricingSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
};

export default HomePage;