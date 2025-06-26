import { SubscriptionPlan, SubscriptionPlanTier, BarbershopProfile } from './types';

// Colors (already in tailwind.config, but good for JS reference if needed elsewhere)
export const PRIMARY_BLUE = '#007BFF';
export const LIGHT_BLUE = '#E6F0FF';
export const PRIMARY_BLUE_DARK = '#0056b3';
export const WHITE = '#FFFFFF';
export const TEXT_DARK = '#333333';
export const TEXT_LIGHT = '#666666';
export const BORDER_COLOR = '#DDDDDD';

export const NAVALHA_SVG_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
    <path d="M19.528 5.682a1.5 1.5 0 00-1.06-.432H5.532a1.5 1.5 0 00-1.061.432L2.09 8.064a1.5 1.5 0 000 2.121l4.907 4.907a.75.75 0 01.21.53v4.512a.75.75 0 00.75.75H9a.75.75 0 00.75-.75V15.75h4.5v4.384a.75.75 0 00.75.75h1.136a.75.75 0 00.75-.75v-4.512a.75.75 0 01.21-.53l4.908-4.907a1.5 1.5 0 000-2.121l-2.38-2.382zM17.47 9l-3.97 3.97h-3V9h6.97zM6.53 9H9v3.97L5.03 9h1.5z" />
  </svg>
`;

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: SubscriptionPlanTier.FREE,
    name: 'Plano Grátis',
    price: 0,
    appointmentLimit: 20,
    employeeLimit: 1,
    features: ['Até 20 agendamentos/mês', '1 funcionário', 'Página pública da barbearia'],
  },
  {
    id: SubscriptionPlanTier.PRO,
    name: 'Plano Pro',
    price: 29.90,
    appointmentLimit: 'unlimited',
    employeeLimit: 3,
    features: ['Agendamentos ilimitados', 'Até 3 funcionários', 'Suporte prioritário', 'Gestão de clientes'],
  },
  {
    id: SubscriptionPlanTier.PREMIUM,
    name: 'Plano Premium',
    price: 59.90,
    appointmentLimit: 'unlimited',
    employeeLimit: 'unlimited',
    features: ['Todos os recursos Pro', 'Funcionários ilimitados', 'Lembretes automáticos (simulado)', 'Relatórios avançados (simulado)'],
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