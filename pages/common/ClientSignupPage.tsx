import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { NAVALHA_SVG_ICON, MIN_PASSWORD_LENGTH } from '../../constants';
import { useNotification } from '../../contexts/NotificationContext';

const ClientSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signupClient, loading: authLoading } = useAuth();
  const { addNotification } = useNotification();

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (formValues) => {
      const newUser = await signupClient(formValues.name, formValues.email, formValues.phone, formValues.password);
      if (newUser) {
        addNotification({ message: 'Cadastro realizado com sucesso! Faça login para continuar.', type: 'success' });
        navigate('/login');
      }
      // Error notification is handled by AuthContext or signupClient itself
    },
    validate: (formValues) => {
      const newErrors: Record<string, string> = {};
      if (!formValues.name.trim()) newErrors.name = 'Nome é obrigatório.';
      if (!formValues.email.trim()) newErrors.email = 'E-mail é obrigatório.';
      else if (!/\S+@\S+\.\S+/.test(formValues.email)) newErrors.email = 'E-mail inválido.';
      if (!formValues.phone.trim()) newErrors.phone = 'Telefone é obrigatório.';
       else if (!/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(formValues.phone)) newErrors.phone = 'Telefone inválido. Formato: (XX) XXXXX-XXXX ou XXXXXXXX.';
      if (!formValues.password) newErrors.password = 'Senha é obrigatória.';
      else if (formValues.password.length < MIN_PASSWORD_LENGTH) newErrors.password = `Senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
      if (formValues.password !== formValues.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem.';
      return newErrors;
    },
  });

  return (
    <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center bg-gradient-to-br from-white to-light-blue p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-primary-blue/20">
        <Link to="/" className="flex flex-col items-center mb-6 group">
          <span className="text-primary-blue w-16 h-16 sm:w-20 sm:h-20 group-hover:opacity-80 transition-opacity" dangerouslySetInnerHTML={{ __html: NAVALHA_SVG_ICON }} />
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-center text-primary-blue group-hover:opacity-80 transition-opacity">Cadastro de Cliente</h2>
        </Link>
        <p className="mb-6 text-sm text-center text-gray-600">Crie sua conta para agendar serviços de forma rápida e fácil.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Seu nome como será exibido"
            autoComplete="name"
            disabled={isSubmitting || authLoading}
          />
          <Input
            label="E-mail"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="seu@email.com"
            autoComplete="email"
            disabled={isSubmitting || authLoading}
          />
          <Input
            label="Telefone (com DDD)"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="(XX) XXXXX-XXXX"
            autoComplete="tel"
            disabled={isSubmitting || authLoading}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
            autoComplete="new-password"
            disabled={isSubmitting || authLoading}
          />
          <Input
            label="Confirmar Senha"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Repita a senha criada"
            autoComplete="new-password"
            disabled={isSubmitting || authLoading}
          />
          <Button type="submit" fullWidth isLoading={isSubmitting || authLoading} size="lg" className="mt-2">
            Criar Conta de Cliente
          </Button>
        </form>

        <p className="mt-8 text-xs sm:text-sm text-center text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-primary-blue hover:underline">
            Faça Login
          </Link>
        </p>
         <p className="mt-2 text-xs sm:text-sm text-center text-gray-600">
          Representa uma barbearia?{' '}
          <Link to="/signup/barbershop" className="font-medium text-primary-blue hover:underline">
            Cadastre sua Barbearia aqui
          </Link>
        </p>
      </div>
       <Link to="/" className="mt-6 text-sm text-primary-blue hover:underline block text-center">
            &larr; Voltar para a Página Inicial
        </Link>
    </div>
  );
};

export default ClientSignupPage;