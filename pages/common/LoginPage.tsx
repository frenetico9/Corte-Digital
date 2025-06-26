import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { NAVALHA_SVG_ICON } from '../../constants';
import { useNotification } from '../../contexts/NotificationContext';
import { UserType } from '../../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authLoading } = useAuth();
  const { addNotification } = useNotification();
  
  const from = location.state?.from?.pathname || "/";

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (formValues) => {
      const loggedInUser = await login(formValues.email, formValues.password);
      if (loggedInUser) {
        addNotification({ message: 'Login bem-sucedido!', type: 'success' });
        if (loggedInUser.type === UserType.ADMIN) {
          navigate(from.startsWith('/admin') ? from : '/admin/overview', { replace: true });
        } else if (loggedInUser.type === UserType.CLIENT) {
          navigate(from.startsWith('/client') ? from : '/client/appointments', { replace: true });
        } else {
          navigate('/', { replace: true }); // Fallback
        }
      }
      // Error notification is handled by AuthContext or login function itself
    },
    validate: (formValues) => {
      const newErrors: Record<string, string> = {};
      if (!formValues.email) newErrors.email = 'E-mail é obrigatório.';
      else if (!/\S+@\S+\.\S+/.test(formValues.email)) newErrors.email = 'E-mail inválido.';
      if (!formValues.password) newErrors.password = 'Senha é obrigatória.';
      return newErrors;
    },
  });

  return (
    <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center bg-gradient-to-br from-white to-light-blue p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-primary-blue/20">
        <Link to="/" className="flex flex-col items-center mb-6 group">
          <span className="text-primary-blue w-16 h-16 sm:w-20 sm:h-20 group-hover:opacity-80 transition-opacity" dangerouslySetInnerHTML={{ __html: NAVALHA_SVG_ICON }} />
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-center text-primary-blue group-hover:opacity-80 transition-opacity">Login Navalha Digital</h2>
        </Link>
        <p className="mb-6 text-sm text-center text-gray-600">Acesse sua conta para continuar.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="E-mail"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="seu@email.com"
            autoComplete="email"
            leftIcon={<span className="material-icons-outlined text-gray-400">email</span>}
            disabled={isSubmitting || authLoading}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Sua senha"
            autoComplete="current-password"
            leftIcon={<span className="material-icons-outlined text-gray-400">lock</span>}
            disabled={isSubmitting || authLoading}
          />
          <Button type="submit" fullWidth isLoading={isSubmitting || authLoading} size="lg">
            Entrar
          </Button>
        </form>

        <p className="mt-8 text-xs sm:text-sm text-center text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/signup/client" className="font-medium text-primary-blue hover:underline">
            Cadastre-se como Cliente
          </Link>
          <br className="sm:hidden"/> <span className="hidden sm:inline">ou</span>{' '}
          <Link to="/signup/barbershop" className="font-medium text-primary-blue hover:underline">
            Cadastre sua Barbearia
          </Link>
        </p>
      </div>
       <Link to="/" className="mt-6 text-sm text-primary-blue hover:underline block text-center">
            &larr; Voltar para a Página Inicial
        </Link>
    </div>
  );
};

export default LoginPage;