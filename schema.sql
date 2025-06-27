-- Habilita a extensão para gerar UUIDs (se ainda não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para tipos de usuário
CREATE TYPE user_type AS ENUM ('client', 'admin');

-- Enum para status de agendamento
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled_by_client', 'cancelled_by_admin');

-- Enum para planos de assinatura
CREATE TYPE subscription_plan_tier AS ENUM ('free', 'pro');

-- Tabela de Usuários (Clientes e Administradores de Barbearias)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Em um app real, armazene o hash da senha
    type user_type NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    barbershop_name VARCHAR(255), -- Apenas para admins no momento do cadastro inicial
    address TEXT, -- Apenas para admins no momento do cadastro inicial
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Perfis das Barbearias
CREATE TABLE barbershop_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    responsible_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    working_hours JSONB, -- Ex: '[{"dayOfWeek": 1, "start": "09:00", "end": "18:00", "isOpen": true}, ...]'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Assinaturas das Barbearias
CREATE TABLE barbershop_subscriptions (
    barbershop_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    plan_id subscription_plan_tier NOT NULL DEFAULT 'free',
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'past_due', 'cancelled'
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    next_billing_date TIMESTAMPTZ,
    stripe_customer_id VARCHAR(255), -- Exemplo para integração de pagamento
    stripe_subscription_id VARCHAR(255)
);

-- Tabela de Serviços oferecidos pelas barbearias
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    duration INTEGER NOT NULL, -- em minutos
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Barbeiros (membros da equipe)
CREATE TABLE barbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    available_hours JSONB, -- Horários específicos do barbeiro, sobrepõe o da barbearia
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Junção para associar barbeiros a serviços
CREATE TABLE barber_services (
    barber_id UUID NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (barber_id, service_id)
);

-- Tabela de Agendamentos
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    barbershop_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    barber_id UUID REFERENCES barbers(id) ON DELETE SET NULL, -- Opcional, se o barbeiro for excluído, o agendamento permanece
    "date" DATE NOT NULL,
    "time" TIME NOT NULL,
    status appointment_status NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Avaliações
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    barbershop_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reply TEXT,
    reply_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para otimizar consultas comuns
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_barbershop_id ON appointments(barbershop_id);
CREATE INDEX idx_appointments_date ON appointments("date");
CREATE INDEX idx_services_barbershop_id ON services(barbershop_id);
CREATE INDEX idx_reviews_barbershop_id ON reviews(barbershop_id);

-- Função para atualizar o campo 'updated_at' automaticamente
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para as tabelas que possuem 'updated_at'
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_barbershop_profiles
BEFORE UPDATE ON barbershop_profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_services
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_barbers
BEFORE UPDATE ON barbers
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_appointments
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
