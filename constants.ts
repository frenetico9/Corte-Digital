import { SubscriptionPlan, SubscriptionPlanTier, BarbershopProfile } from './types';

// Colors (already in tailwind.config, but good for JS reference if needed elsewhere)
export const PRIMARY_BLUE = '#0052FF';
export const LIGHT_BLUE = '#E9F0FF';
export const PRIMARY_BLUE_DARK = '#0040CC';
export const WHITE = '#FFFFFF';
export const TEXT_DARK = '#111827';
export const TEXT_LIGHT = '#6B7280';
export const BORDER_COLOR = '#E5E7EB';

export const NAVALHA_LOGO_URL = 'https://i.imgur.com/OViX73g.png';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: SubscriptionPlanTier.FREE,
    name: 'Plano Grátis',
    price: 0,
    appointmentLimit: 20,
    employeeLimit: 1,
    features: [
      'Até 20 agendamentos por mês',
      'Cadastro de 1 funcionário',
      'Página online da barbearia',
      'Gestão de clientes e serviços',
      'Suporte via e-mail',
      'Notificações de agendamento'
    ],
  },
  {
    id: SubscriptionPlanTier.PRO,
    name: 'Plano Pro',
    price: 49.90,
    appointmentLimit: 'unlimited',
    employeeLimit: 5,
    features: [
      'Agendamentos ilimitados',
      'Cadastro de até 5 funcionários',
      'Destaque PRO nas buscas',
      'Selo Dourado de Confiança',
      'Relatórios e análises avançadas',
      'Suporte prioritário via WhatsApp',
      'Sem taxas de transação'
    ],
  },
];

export const MOCK_API_DELAY = 500; // ms, adjust for testing

export const DAYS_OF_WEEK = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
export const TIME_SLOTS_INTERVAL = 30; // minutes, for generating available slots

export const DEFAULT_BARBERSHOP_WORKING_HOURS: BarbershopProfile['workingHours'] = [
  { dayOfWeek: 0, start: '09:00', end: '18:00', isOpen: false }, // Sunday
  { dayOfWeek: 1, start: '09:00', end: '18:00', isOpen: true },  // Monday
  { dayOfWeek: 2, start: '09:00', end: '18:00', isOpen: true },  // Tuesday
  { dayOfWeek: 3, start: '09:00', end: '18:00', isOpen: true },  // Wednesday
  { dayOfWeek: 4, start: '09:00', end: '18:00', isOpen: true },  // Thursday
  { dayOfWeek: 5, start: '09:00', end: '18:00', isOpen: true },  // Friday
  { dayOfWeek: 6, start: '10:00', end: '16:00', isOpen: true }, // Saturday
];

export const MIN_PASSWORD_LENGTH = 6;